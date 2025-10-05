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

}