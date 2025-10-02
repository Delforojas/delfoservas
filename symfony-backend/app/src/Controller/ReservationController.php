<?php

namespace App\Controller;

use App\Entity\Reservation;
use App\Entity\User;
use App\Entity\Clase;
use App\Entity\Bonos;
use App\Repository\ReservationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\DBAL\Connection;
use Symfony\Component\Security\Http\Attribute\IsGranted;


#[Route('/api/reservations')]
class ReservationController extends AbstractController
{
    #[Route('', name: 'reservation_index', methods: ['GET'])]
    public function index(ReservationRepository $reservationRepository): JsonResponse
    {
        $reservations = $reservationRepository->findAll();
        $data = [];

        foreach ($reservations as $reservation) {
            $data[] = [
                'id' => $reservation->getId(),
                'usuario_id' => $reservation->getUsuario()->getId(),
                'clase_id' => $reservation->getClase()->getId(),
                'bono_id' => $reservation->getBono()->getId(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'reservation_show', methods: ['GET'])]
    public function show(Reservation $reservation): JsonResponse
    {
        return $this->json([
            'id' => $reservation->getId(),
            'usuario_id' => $reservation->getUsuario()->getId(),
            'clase_id' => $reservation->getClase()->getId(),
            'bono_id' => $reservation->getBono()->getId(),
        ]);
    }

    #[Route('', name: 'reservation_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $usuario = $em->getRepository(User::class)->find($data['usuario_id']);
        $clase = $em->getRepository(Clase::class)->find($data['clase_id']);
        $bono = $em->getRepository(Bonos::class)->find($data['bono_id']);

        if (!$usuario || !$clase || !$bono) {
            return $this->json(['error' => 'Usuario, clase o bono no válido'], 400);
        }

        $reservation = new Reservation();
        $reservation->setUsuario($usuario);
        $reservation->setClase($clase);
        $reservation->setBono($bono);

        $em->persist($reservation);
        $em->flush();

        return $this->json(['message' => 'Reserva creada correctamente', 'id' => $reservation->getId()], 201);
    }

    #[Route('/{id}', name: 'reservation_update', methods: ['PUT'])]
public function update(Request $request, Reservation $reservation, EntityManagerInterface $em)
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['usuario_id'])) {
            $usuario = $em->getRepository(User::class)->find($data['usuario_id']);
            if ($usuario) $reservation->setUsuario($usuario);
        }

        if (isset($data['clase_id'])) {
            $clase = $em->getRepository(Clase::class)->find($data['clase_id']);
            if ($clase) $reservation->setClase($clase);
        }

        if (isset($data['bono_id'])) {
            $bono = $em->getRepository(Bonos::class)->find($data['bono_id']);
            if ($bono) $reservation->setBono($bono);
        }

        $em->flush();

        return $this->json(['message' => 'Reserva actualizada correctamente']);
    }

    #[Route('/{id}', name: 'reservation_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(Reservation $reservation, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($reservation);
        $em->flush();

        return $this->json(['message' => 'Reserva eliminada correctamente']);
    }
 

    // ---- CLASES POR DÍA ----

        #[Route('/clases/monday', name: 'clases_lunes', methods: ['GET'])]
        public function monday(ReservationRepository $reservationRepository): JsonResponse
        {
            $user = $this->getUser();
            if (!$user || !method_exists($user, 'getId')) {
                return $this->json(['error' => 'No autenticado'], 401);
            }
              return $this->json($reservationRepository->monday($user->getId()));
        }
        #[Route('/clases/tuesday', name: 'clases_martes', methods: ['GET'])]
        public function tuesday(ReservationRepository $reservationRepository): JsonResponse
        {
            $user = $this->getUser();
            if (!$user || !method_exists($user, 'getId')) {
                return $this->json(['error' => 'No autenticado'], 401);
            }
              return $this->json($reservationRepository->tuesday($user->getId()));
        }
        #[Route('/clases/wednesday', name: 'clases_miercoles', methods: ['GET'])]
        public function wednesday(ReservationRepository $reservationRepository): JsonResponse
        {
            $user = $this->getUser();
            if (!$user || !method_exists($user, 'getId')) {
                return $this->json(['error' => 'No autenticado'], 401);
            }
              return $this->json($reservationRepository->wednesday($user->getId()));
        }
        #[Route('/clases/thursday', name: 'clases_jueves', methods: ['GET'])]
        public function thursday(ReservationRepository $reservationRepository): JsonResponse
        {
            $user = $this->getUser();
            if (!$user || !method_exists($user, 'getId')) {
                return $this->json(['error' => 'No autenticado'], 401);
            }
              return $this->json($reservationRepository->thursday($user->getId()));
        }
        #[Route('/clases/friday', name: 'clases_viernes', methods: ['GET'])]
        public function friday(ReservationRepository $reservationRepository): JsonResponse
        {
            $user = $this->getUser();
            if (!$user || !method_exists($user, 'getId')) {
                return $this->json(['error' => 'No autenticado'], 401);
            }
              return $this->json($reservationRepository->friday($user->getId()));
        }


 
#[Route('/reservar/{claseId}', name: 'reservation_reservar', methods: ['POST'])]
    public function reservar(int $claseId, Connection $conn): JsonResponse
    {
        $user = $this->getUser();
        if (!$user || !method_exists($user, 'getId')) {
            return $this->json(['error' => 'No autenticado'], 401);
        }
        $uid = (int)$user->getId();

        try {
            $conn->beginTransaction();

            // 1) Clase (tipo y aforo). Bloqueamos la fila para concurrencia.
            $clase = $conn->fetchAssociative(
                "SELECT id, tipoclase, aforo_clase 
                 FROM clase 
                 WHERE id = :cid
                 FOR UPDATE",
                ['cid' => $claseId]
            );
            if (!$clase) {
                $conn->rollBack();
                return $this->json(['error' => 'Clase no encontrada'], 404);
            }
            $tipoId = (int)$clase['tipoclase'];

            // 2) ¿Reserva duplicada?
            $dup = $conn->fetchOne(
                "SELECT 1 FROM reservation 
                 WHERE usuario_id = :uid AND clase_id = :cid 
                 LIMIT 1",
                ['uid' => $uid, 'cid' => $claseId]
            );
            if ($dup) {
                $conn->rollBack();
                return $this->json(['error' => 'Ya tienes reserva en esta clase'], 409);
            }

            // 3) (Opcional) Comprobar aforo si no confías 100% en los triggers
            $count = (int)$conn->fetchOne(
                "SELECT COUNT(*) FROM reservation WHERE clase_id = :cid",
                ['cid' => $claseId]
            );
            if ($count >= (int)$clase['aforo_clase']) {
                $conn->rollBack();
                return $this->json(['error' => 'Clase completa'], 409);
            }

            // 4) Localizar bono activo para este usuario + tipo (vía VISTA)
            $bonoRow = $conn->fetchAssociative(
                "SELECT bono_id
                   FROM vista_usuarios_bonos_activos
                  WHERE usuario_id = :uid
                    AND tipoclase = :tipo
               ORDER BY bono_id
                  LIMIT 1",
                ['uid' => $uid, 'tipo' => $tipoId]
            );
            if (!$bonoRow || !isset($bonoRow['bono_id'])) {
                $conn->rollBack();
                return $this->json(['error' => 'No tienes un bono activo para este tipo de clase'], 409);
            }
            $bonoId = (int)$bonoRow['bono_id'];

            // 5) Insertar reserva (los triggers se ocupan de plazas/bono)
            $reservationId = $conn->fetchOne(
                "INSERT INTO reservation (usuario_id, clase_id, bono_id)
                 VALUES (:uid, :cid, :bid)
                 RETURNING id",
                ['uid' => $uid, 'cid' => $claseId, 'bid' => $bonoId]
            );

            $conn->commit();
            return $this->json([
                'message' => 'Reserva creada con éxito',
                'reservation_id' => (int)$reservationId,
            ], 201);
            
            $clase = $conn->fetchAssociative(
                    "SELECT id, tipoclase, plazas, completa
                    FROM clase
                    WHERE id = :cid
                    FOR UPDATE",
                    ['cid' => $claseId]
                );
                if (!$clase) {
                    $conn->rollBack();
                    return $this->json(['error' => 'Clase no encontrada'], 404);
                }
                // si usas boolean en PG: 't'/'f' o cast explícito
                $completa = filter_var($clase['completa'], FILTER_VALIDATE_BOOLEAN) || (int)$clase['plazas'] <= 0;
                if ($completa) {
                    $conn->rollBack();
                    return $this->json(['error' => 'Clase completa'], 409);
                }
                $tipoId = (int)$clase['tipoclase'];



        } catch (UniqueConstraintViolationException $e) {
            if ($conn->isTransactionActive()) $conn->rollBack();
            return $this->json(['error' => 'Ya tienes reserva en esta clase'], 409);
        } catch (\Throwable $e) {
            if ($conn->isTransactionActive()) $conn->rollBack();
            return $this->json(['error' => 'Error al reservar'], 500);
        }
    }

    #[Route('/usuarios/{userId}/reservas/{dia}', methods: ['GET'])]
    public function reservasPorDia(int $userId, string $dia, Connection $conn): JsonResponse
    {
        $map = [
            'lunes'=>'Lunes','martes'=>'Martes','miercoles'=>'Miércoles','miércoles'=>'Miércoles',
            'jueves'=>'Jueves','viernes'=>'Viernes','sabado'=>'Sábado','sábado'=>'Sábado','domingo'=>'Domingo'
        ];
        $key = strtr(mb_strtolower($dia,'UTF-8'), ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u']);
        if (!isset($map[$key])) return new JsonResponse(['error'=>'Día inválido'],400);
        $diaBD = $map[$key];

        $data = $conn->transactional(function (Connection $c) use ($userId, $diaBD) {
            // 👇 aquí no uses parámetro, tienes que interpolar directo
            $c->executeStatement("SET LOCAL app.user_id = {$userId}");

            return $c->fetchAllAssociative(
                'SELECT * FROM vista_clases_con_reserva
                WHERE dia = :dia AND usuario_id IS NOT NULL
                ORDER BY fecha, hora',
                ['dia' => $diaBD]
            );
        });

        return new JsonResponse($data);
    }
}


