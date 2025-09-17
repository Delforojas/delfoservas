<?php
namespace App\Controller;

use App\Entity\Reservation;
use App\Entity\Users;
use App\Entity\Clase;
use App\Entity\Bonos;
use App\Repository\ReservationRepository;
use App\Repository\ClaseRepository; // ✅ IMPORTA EL REPO CORRECTO
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser; 

#[Route('/api')]
class ReservationController extends AbstractController
{
    #[Route('/reservations', name: 'reservation_index', methods: ['GET'])]
    public function index(ReservationRepository $reservationRepository): JsonResponse {
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

    #[Route('/reservations/{id}', name: 'reservation_show', methods: ['GET'])]
    public function show(Reservation $reservation): JsonResponse {
        return $this->json([
            'id' => $reservation->getId(),
            'usuario_id' => $reservation->getUsuario()->getId(),
            'clase_id' => $reservation->getClase()->getId(),
            'bono_id' => $reservation->getBono()->getId(),
        ]);
    }

    #[Route('/reservations/create', name: 'reservation_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse { 
    $data = json_decode($request->getContent(), true) ?? [];

    $usuario = $em->getRepository(Users::class)->find($data['usuario_id'] ?? null);
    $clase   = $em->getRepository(Clase::class)->find($data['clase_id'] ?? null);
    $bono    = $em->getRepository(Bonos::class)->find($data['bono_id'] ?? null);

    if (!$usuario || !$clase || !$bono) {
        return $this->json(['error' => 'Usuario, clase o bono no válido'], 400);
    }

    // (Opcional) UX: evita duplicados antes del flush (la BD también lo protege)
    $exists = $em->getConnection()->fetchOne(
        'SELECT 1 FROM reservation WHERE usuario_id = ? AND clase_id = ? LIMIT 1',
        [$usuario->getId(), $clase->getId()]
    );
    if ($exists) {
        return $this->json(['error' => 'Ya tienes esta clase reservada'], 409);
    }

    $reservation = new Reservation();
    $reservation->setUsuario($usuario);
    $reservation->setClase($clase);
    $reservation->setBono($bono);

    try {
        $em->persist($reservation);
        $em->flush();

        return $this->json([
            'message' => 'Reserva creada correctamente',
            'id' => $reservation->getId()
        ], 201);

    } catch (\Throwable $e) {
        // Desenrollar para encontrar SQLSTATE del driver
        $cur = $e;
        $sqlState = null;
        $rawMsg = $e->getMessage();

        while ($cur) {
            if ($cur instanceof \Doctrine\DBAL\Exception\DriverException && method_exists($cur, 'getSQLState')) {
                $sqlState = $cur->getSQLState(); // 'P0001', '23505', etc.
            }
            if ($cur->getMessage()) {
                $rawMsg = $cur->getMessage();
            }
            $cur = $cur->getPrevious();
        }

        // Limpiar mensaje de Postgres
        $msg = preg_replace('/^.*ERROR:\s*/', '', $rawMsg);
        $msg = preg_replace('/\s*CONTEXT:.*$/s', '', $msg);
        $msg = trim($msg) ?: 'Error de base de datos';

        // Mapear códigos
        if ($sqlState === '23505') {                 // unique_violation (único usuario_id+clase_id)
            return $this->json(['error' => 'Ya tienes esta clase reservada'], 409);
        }
        if ($sqlState === 'P0001') {                 // RAISE EXCEPTION de tu trigger
            return $this->json(['error' => $msg], 400);
        }

        // Otros errores DB → 400 con mensaje limpio
        return $this->json(['error' => $msg], 400);
    }
}

    #[Route('/reservations/update/{id}', name: 'reservation_update', methods: ['PUT'])]
    public function update(Request $request, Reservation $reservation, EntityManagerInterface $em): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (isset($data['usuario_id'])) {
            $usuario = $em->getRepository(Users::class)->find($data['usuario_id']);
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

    #[Route('/reservations/delete/{id}', name: 'reservation_delete', methods: ['DELETE'])]
    public function delete(Reservation $reservation, EntityManagerInterface $em): JsonResponse { 
        $em->remove($reservation);
        $em->flush();

        return $this->json(['message' => 'Reserva eliminada correctamente']);
    }
    #[Route('/reservar/{id}', name: 'reservar_clase', methods: ['POST'])]
    public function reservar(
    string $id,
    ClaseRepository $claseRepo,
    EntityManagerInterface $em,
    #[CurrentUser] \App\Entity\Users $user
): JsonResponse {
    $clase = $claseRepo->find($id);
    if (!$clase) return $this->json(['error' => 'Clase no encontrada'], 404);

    if ($clase->isCompleta()) {
        return $this->json(['error' => 'Clase completa'], 400);
    }

    // ¿ya inscrito?
    $exists = (int)$em->createQuery(
        'SELECT COUNT(r.id) FROM App\Entity\Reservation r
         WHERE r.usuario = :u AND r.clase = :c'
    )->setParameters(['u' => $user, 'c' => $clase])
     ->getSingleScalarResult();

    if ($exists > 0) {
        return $this->json(['error' => 'Ya estás inscrito en esta clase'], 400);
    }

    // ✅ Buscar BONO válido del usuario PARA EL MISMO TIPOCLASE DE LA CLASE
    // Requisitos opcionales: bono con clases_restantes > 0 y (si manejas) estado = 'activo'
    $qb = $em->getRepository(Bonos::class)->createQueryBuilder('b')
        ->innerJoin('b.wallet', 'w')
        ->innerJoin('b.tipoclase', 't')
        ->where('w.usuario = :usuario')          // Wallet del usuario logueado
        ->andWhere('t = :tipoClase')             // mismo tipoclase que la clase
        ->andWhere('b.clasesRestantes > 0')      // si existe la propiedad
        //->andWhere('b.estado = :estado')       // si usas estado, descomenta
        ->setParameter('usuario', $user)
        ->setParameter('tipoClase', $clase->getTipoclase())
        //->setParameter('estado', 'activo')
        ->setMaxResults(1);

    $bono = $qb->getQuery()->getOneOrNullResult();

    if (!$bono) {
        return $this->json(['error' => 'No tienes un bono disponible para esta clase'], 400);
    }

    // (Opcional) descontar 1 clase del bono si gestionas el campo
    // $bono->setClasesRestantes($bono->getClasesRestantes() - 1);

    $reserva = new Reservation();
    $reserva->setUsuario($user);
    $reserva->setClase($clase);
    $reserva->setBono($bono); // 🔴 imprescindible (bono_id es NOT NULL)

    $em->persist($reserva);
    $em->flush();

    return $this->json(['success' => 'Reserva creada']);
}
}