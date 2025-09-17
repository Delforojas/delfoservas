<?php

namespace App\Controller;

use App\Entity\Clase;
use App\Entity\TipoClase;
use App\Repository\ClaseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


use Doctrine\DBAL\Connection;

#[Route('/api/clases')]
class ClaseController extends AbstractController
{
    #[Route('', name: 'clase_index', methods: ['GET'])]
    public function index(ClaseRepository $repo): JsonResponse
    {
        return $this->json($repo->listarIndex());
    }

    #[Route('/{id}', name: 'clase_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(Clase $clase): JsonResponse
    {
        return $this->json([
            'id' => $clase->getId(),
            'nombre' => $clase->getNombre(),
            'tipoclase' => $clase->getTipoclase()?->getId(),
            'teacher' => $clase->getTeacher()?->getId(),
            'fecha' => $clase->getFecha()?->format('Y-m-d'),
            'hora' => $clase->getHora()?->format('H:i'),
            'aforo_clase' => $clase->getAforoClase(),
            'room' => $clase->getRoom()?->getId(),
        ]);
    }
    


    #[Route('/create', name: 'clase_create', methods: ['POST'])]
    public function create(Request $request, ClaseRepository $repo): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];

        $clase = $repo->crearDesdeArray($data);
        if (!$clase) {
            return $this->json(['error' => 'Datos de relación no válidos'], 400);
        }

        return $this->json(
            ['message' => 'Clase creada con éxito', 'id' => $clase->getId()],
            201
        );
    }

    

    #[Route('/update/{id}', name: 'clase_update', methods: ['PUT'])]
    public function update(int $id, Request $request, ClaseRepository $repo): JsonResponse
    {
        $clase = $repo->find($id);
        if (!$clase) {
            return $this->json(['error' => 'Clase no encontrada'], 404);
        }

        $data = json_decode($request->getContent(), true) ?? [];

        $ok = $repo->actualizarDesdeArray($clase, $data);
        if (!$ok) {
            return $this->json(['error' => 'Datos de relación no válidos'], 400);
        }

        return $this->json(['message' => 'Clase actualizada con éxito']);
    }



    #[Route('/delete/{id}', name: 'clase_delete', methods: ['DELETE'])]
    public function delete(Clase $clase, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($clase);
        $em->flush();

        return $this->json(['message' => 'Clase eliminada con éxito']);
    }

    // ---- VISTA ----
    
    #[Route('/vista', name: 'clases_vista', methods: ['GET'])]
    public function vistaClases(ClaseRepository $repo): JsonResponse
    {
        return $this->json($repo->listarVista()); 
    }
    

    
     #[Route('/mias', name: 'clases_mias', methods: ['GET'])]
    public function misClases(ClaseRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user || !method_exists($user, 'getId')) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $rows = $repo->listarDeProfesor($user->getId());
        return $this->json($rows);
    }


     #[Route('/alumnos/{id}/', name: 'clase_alumnos', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function alumnosDeClase(int $id, ClaseRepository $repo): JsonResponse
    {
        return $this->json($repo->porClase($id));
    }
}