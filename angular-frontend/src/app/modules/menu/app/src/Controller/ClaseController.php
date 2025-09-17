<?php

namespace App\Controller;

use App\Entity\Clase;
use App\Entity\Users;
use App\Entity\TipoClase;
use App\Entity\Room;
use App\Repository\ClaseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;      // servicio
use Symfony\Component\Security\Http\Attribute\Security as SecurityAttribute; 

#[Route('/api/clases')]
class ClaseController extends AbstractController
{

    public function __construct(private ClaseRepository $repo) {}

    #[Route('', name: 'clase_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $clases = $this->repo->findAll();
        $data = [];

        foreach ($clases as $clase) {
            $data[] = [
                'id'          => $clase->getId(),
                'nombre'      => $clase->getNombre(),
                'fecha'       => $clase->getFecha()?->format('Y-m-d'),
                'hora'        => $clase->getHora()?->format('H:i'),
                'aforo_clase' => $clase->getAforoClase(),
                'teacher'     => $clase->getTeacher()?->getNombre(),
                'tipoclase'   => $clase->getTipoclase()?->getNombre(),
                'room'        => $clase->getRoom()?->getDescripcion(),
                'completa'    => $clase->isCompleta(),
                'plazas'      => $clase->getPlazas(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/vista', name: 'clase_vista_index', methods: ['GET'])]
    public function indexVista(ClaseRepository $repo): JsonResponse
    {
        return $this->json($repo->findAllOrderByFechaHora());
    }

   #[Route('/lunes', name: 'clase_lunes', methods: ['GET'])]
    public function lunes(ClaseRepository $repo): JsonResponse
    {
        return $this->json($repo->findByLunes());
    }

    #[Route('/martes', name: 'clase_martes', methods: ['GET'])]
    public function martes(ClaseRepository $repo): JsonResponse
    {
        return $this->json($repo->findByMartes());
    }

    #[Route('/miercoles', name: 'clase_miercoles', methods: ['GET'])]
    public function miercoles(ClaseRepository $repo): JsonResponse
    {
        return $this->json($repo->findByMiercoles());
    }

    #[Route('/jueves', name: 'clase_jueves', methods: ['GET'])]
    public function jueves(ClaseRepository $repo): JsonResponse
    {
        return $this->json($repo->findByJueves());
    }

    #[Route('/viernes', name: 'clase_viernes', methods: ['GET'])]
    public function viernes(ClaseRepository $repo): JsonResponse
    {
        return $this->json($repo->findByViernes());
    }
 #[Route('/{id}', name: 'clase_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(int $id): JsonResponse
    {
        $row = $this->repo->findAggregatedById($id);
        if (!$row) {
            return $this->json(['error' => 'Clase no encontrada'], 404);
        }

        // Si la vista NO trae 'completa', calcula aquí:
        if (!array_key_exists('completa', $row)) {
            $row['completa'] = ((int)$row['plazas']) <= 0;
        }

        return $this->json($row);
    }
    #[Route('/create', name: 'clase_create', methods: ['POST'])]
public function create(Request $request, EntityManagerInterface $em): JsonResponse
{
    // 🔐 Solo PROFESOR o ADMIN pueden crear
    if (!$this->isGranted('ROLE_TEACHER') && !$this->isGranted('ROLE_ADMIN')) {
        return $this->json(['error' => 'No tienes permisos para crear clases'], 403);
    }

    $data = json_decode($request->getContent(), true);

    // Relaciones obligatorias
    $tipoClase = $em->getRepository(TipoClase::class)->find($data['tipoclase'] ?? null);
    $room      = $em->getRepository(Room::class)->find($data['room'] ?? null);
    if (!$tipoClase || !$room) {
        return $this->json(['error' => 'Datos de relación no válidos (tipoclase/room)'], 400);
    }

    // 🔐 Decidir teacher:
    // - Si eres PROFESOR (no admin), ignoramos lo que venga en el body y usamos el usuario logueado
    // - Si eres ADMIN, puede elegir teacher, pero debe existir y ser profesor o admin
    if ($this->isGranted('ROLE_TEACHER') && !$this->isGranted('ROLE_ADMIN')) {
        /** @var Users $teacher */
        $teacher = $this->getUser();
    } else {
        $teacher = $em->getRepository(Users::class)->find($data['teacher'] ?? null);
        if (!$teacher) {
            return $this->json(['error' => 'Teacher no válido'], 400);
        }
        $roles = $teacher->getRoles();
        if (!in_array('ROLE_TEACHER', $roles, true) && !in_array('ROLE_ADMIN', $roles, true)) {
            return $this->json(['error' => 'El teacher debe ser profesor o admin'], 400);
        }
    }

    $clase = new Clase();
    $clase->setNombre($data['nombre'] ?? '');
    $clase->setTipoclase($tipoClase);
    $clase->setTeacher($teacher);
    $clase->setFecha(new \DateTime($data['fecha'] ?? 'now'));
    $clase->setHora(new \DateTime($data['hora'] ?? '00:00'));
    $clase->setAforoClase((int)($data['aforo_clase'] ?? 0));
    $clase->setRoom($room);

    $em->persist($clase);
    $em->flush();

    return $this->json(['message' => 'Clase creada con éxito', 'id' => $clase->getId()], 201);
}

   #[Route('/update/{id}', name: 'clase_update', methods: ['PUT'])]
public function update(Request $request, Clase $clase, EntityManagerInterface $em): JsonResponse
{
    // 🔐 Solo ADMIN o DUEÑO (teacher de la clase)
    /** @var Users $me */
    $me = $this->getUser();
    $esAdmin = $this->isGranted('ROLE_ADMIN');
    $esDueno = $clase->getTeacher()?->getId() === $me?->getId();

    if (!$esAdmin && !$esDueno) {
        return $this->json(['error' => 'No puedes modificar esta clase'], 403);
    }

    $data = json_decode($request->getContent(), true);

    if (isset($data['nombre']))     $clase->setNombre($data['nombre']);
    if (isset($data['tipoclase'])) {
        $tipoClase = $em->getRepository(TipoClase::class)->find($data['tipoclase']);
        if ($tipoClase) $clase->setTipoclase($tipoClase);
    }
    if (isset($data['fecha']))      $clase->setFecha(new \DateTime($data['fecha']));
    if (isset($data['hora']))       $clase->setHora(new \DateTime($data['hora']));
    if (isset($data['aforo_clase']))$clase->setAforoClase((int)$data['aforo_clase']);
    if (isset($data['room'])) {
        $room = $em->getRepository(Room::class)->find($data['room']);
        if ($room) $clase->setRoom($room);
    }

    // 🔐 Cambiar teacher solo ADMIN
    if (isset($data['teacher'])) {
        if (!$esAdmin) {
            return $this->json(['error' => 'Solo admin puede cambiar el teacher'], 403);
        }
        $teacher = $em->getRepository(Users::class)->find($data['teacher']);
        if (!$teacher) return $this->json(['error' => 'Teacher no válido'], 400);

        $roles = $teacher->getRoles();
        if (!in_array('ROLE_PROFESOR', $roles, true) && !in_array('ROLE_ADMIN', $roles, true)) {
            return $this->json(['error' => 'El teacher debe ser profesor o admin'], 400);
        }
        $clase->setTeacher($teacher);
    }

    $em->flush();
    return $this->json(['message' => 'Clase actualizada con éxito']);
}

  #[Route('/delete/{id}', name: 'clase_delete', methods: ['DELETE'])]
public function delete(Clase $clase, EntityManagerInterface $em): JsonResponse
{
    // 🔐 Solo ADMIN o DUEÑO (teacher de la clase)
    /** @var Users $me */
    $me = $this->getUser();
    $esAdmin = $this->isGranted('ROLE_ADMIN');
    $esDueno = $clase->getTeacher()?->getId() === $me?->getId();

    if (!$esAdmin && !$esDueno) {
        return $this->json(['error' => 'No puedes eliminar esta clase'], 403);
    }

    $em->remove($clase);
    $em->flush();

    return $this->json(['message' => 'Clase eliminada con éxito']);
}

     #[Route('/mias', name: 'clases_mias', methods: ['GET'])]
    #[SecurityAttribute("is_granted('ROLE_TEACHER') or is_granted('ROLE_ADMIN')")]
    public function mias(ClaseRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }

        $rows = $repo->findByTeacherFromView($user->getId());
        return new JsonResponse($rows);
    }
#[Route('/clases/{id}/alumnos', name: 'clase_alumnos', methods: ['GET'])]
public function alumnos(int $id, ClaseRepository $repo): JsonResponse
{
    $user = $this->getUser();
    if (!$user) return new JsonResponse(['error' => 'No autenticado'], 401);

    // Si es teacher, que solo vea sus clases
    if (!$this->isGranted('ROLE_ADMIN')) {
        $clase = $repo->find($id);
        if (!$clase) return new JsonResponse(['error' => 'Clase no encontrada'], 404);
        if ($clase->getTeacher()->getId() !== $user->getId()) {
            return new JsonResponse(['error' => 'No autorizado'], 403);
        }
    }

    $rows = $repo->alumnosDeClase($id);
    return new JsonResponse($rows);
}
}