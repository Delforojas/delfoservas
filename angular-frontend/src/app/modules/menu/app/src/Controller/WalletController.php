<?php

namespace App\Controller;

use App\Entity\Wallet;
use App\Repository\WalletRepository;
use App\Entity\Users;
use App\Entity\TipoClase;
use App\Controller\TipoclaseController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;


#[Route('/api/wallet', name: 'api_wallet_')]
class WalletController extends AbstractController
{
    #[Route('', name: 'wallet_index', methods: ['GET'])]
    public function index(WalletRepository $walletRepository): JsonResponse
    {
        $wallets = $walletRepository->findAll();
        $data = [];

        foreach ($wallets as $wallet) {
            $data[] = [
                'id' => $wallet->getId(),
                'fecha' => $wallet->getFecha()->format('Y-m-d'),
                'usuario_id' => $wallet->getUsuario()->getId(),
                'tipoclase_id' => $wallet->getTipoclase()->getId(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'wallet_show', methods: ['GET'])]
    public function show(Wallet $wallet): JsonResponse
    {
        return $this->json([
            'id' => $wallet->getId(),
            'fecha' => $wallet->getFecha()->format('Y-m-d'),
            'usuario_id' => $wallet->getUsuario()->getId(),
            'tipoclase_id' => $wallet->getTipoclase()->getId(),
        ]);
    }

   #[Route('/create', name: 'wallet_create', methods: ['POST'])]
public function create(Request $request, EntityManagerInterface $em): JsonResponse
{
    $data = json_decode($request->getContent(), true) ?? [];

    if (empty($data['fecha']) || empty($data['usuario_id']) || empty($data['tipoclase_id'])) {
        return $this->json(['error' => 'Campos requeridos: fecha, usuario_id, tipoclase_id'], 400);
    }

    try {
        $fecha = new \DateTime($data['fecha']); // esperado: YYYY-MM-DD
    } catch (\Exception $e) {
        return $this->json(['error' => 'Fecha inválida'], 400);
    }

    $usuario   = $em->getRepository(Users::class)->find((int)$data['usuario_id']);
    $tipoClase = $em->getRepository(TipoClase::class)->find((int)$data['tipoclase_id']);

    if (!$usuario || !$tipoClase) {
        return $this->json(['error' => 'Usuario o TipoClase no válido'], 400);
    }

    $wallet = new Wallet();
    $wallet->setFecha($fecha);
    $wallet->setUsuario($usuario);
    $wallet->setTipoclase($tipoClase);

    $em->persist($wallet);
    $em->flush();

    return $this->json(['message' => 'Wallet creado correctamente', 'id' => $wallet->getId()], 201);
}

    #[Route('/delete/{id}', name: 'wallet_delete', methods: ['DELETE'])]
    public function delete(Wallet $wallet, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($wallet);
        $em->flush();

        return $this->json(['message' => 'Wallet eliminado']);
    }
    
}