<?php
namespace App\Controller;


use Doctrine\DBAL\Connection; 
use App\Repository\VistasRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/vistas')]
class BonosViewController extends AbstractController
{
     
     #[Route('/vistabonos/{usuarioId}', name: 'bonos_view_user', methods: ['GET'], requirements: ['usuarioId' => '\d+'])]
    public function bonosViewPorUsuario(int $usuarioId, VistasRepository $repo): JsonResponse
    {
        $rows = $repo->vistaBonosPorUsuario($usuarioId);
        if (!$rows) {
            return $this->json(['message' => 'No se han encontrado bonos para ese usuario'], 404);
        }
        return $this->json($rows);
    }

    #[Route('/usuarioreservas/{id}/reservas', name: 'usuario_reservas', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getReservasUsuario(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getReservasPorUsuario($id));
    }

    #[Route('/usuario-wallet/{id}', name: 'vistas_usuario_wallet', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function usuarioWallet(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getWalletPorUsuario($id));
    }

}