<?php

namespace App\Controller;

use App\Entity\Room;
use App\Repository\RoomRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/room')]
class RoomController extends AbstractController
{
    #[Route('', name: 'room_index', methods: ['GET'])]
    public function index(RoomRepository $roomRepository): JsonResponse
    {
        $rooms = $roomRepository->findAll();
        $data = [];

        foreach ($rooms as $room) {
            $data[] = [
                'id' => $room->getId(),
                'descripcion' => $room->getDescripcion(),
                'aforo_sala' => $room->getAforoSala(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'room_show', methods: ['GET'])]
    public function show(Room $room): JsonResponse
    {
        return $this->json([
            'id' => $room->getId(),
            'descripcion' => $room->getDescripcion(),
            'aforo_sala' => $room->getAforoSala(),
        ]);
    }

    #[Route('', name: 'room_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $room = new Room();
        $room->setDescripcion($data['descripcion'] ?? '');
        $room->setAforoSala($data['aforo_sala'] ?? 0);

        $em->persist($room);
        $em->flush();

        return $this->json(['message' => 'Sala creada correctamente', 'id' => $room->getId()], 201);
    }

    #[Route('/{id}', name: 'room_update', methods: ['PUT'])]
    public function update(Request $request, Room $room, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $room->setDescripcion($data['descripcion'] ?? $room->getDescripcion());
        $room->setAforoSala($data['aforo_sala'] ?? $room->getAforoSala());

        $em->flush();

        return $this->json(['message' => 'Sala actualizada correctamente']);
    }

    #[Route('/{id}', name: 'room_delete', methods: ['DELETE'])]
    public function delete(Room $room, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($room);
        $em->flush();

        return $this->json(['message' => 'Sala eliminada correctamente']);
    }
}