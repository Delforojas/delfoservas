<?php

namespace App\Controller;

use App\Entity\Bonos;
use App\Entity\TipoClase;
use App\Entity\Wallet;
use App\Repository\BonosRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/bonos')]
class BonosController extends AbstractController
{
    #[Route('', name: 'bonos_index', methods: ['GET'])]
    public function index(BonosRepository $bonosRepository): JsonResponse
    {
        $bonos = $bonosRepository->findAll();
        $data = [];

        foreach ($bonos as $bono) {
            $data[] = [
                'id' => $bono->getId(),
                'clases_restantes' => $bono->getClasesRestantes(),
                'clases_totales' => $bono->getClasesTotales(),
                'fecha' => $bono->getFecha()?->format('Y-m-d'),
                'estado' => $bono->getEstado(),
                'tipoclase_id' => $bono->getTipoclase()?->getId(),
                'wallet_id' => $bono->getWallet()?->getId(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'bonos_show', methods: ['GET'])]
    public function show(Bonos $bono): JsonResponse
    {
        return $this->json([
            'id' => $bono->getId(),
            'clases_restantes' => $bono->getClasesRestantes(),
            'clases_totales' => $bono->getClasesTotales(),
            'fecha' => $bono->getFecha()?->format('Y-m-d'),
            'estado' => $bono->getEstado(),
            'tipoclase_id' => $bono->getTipoclase()?->getId(),
            'wallet_id' => $bono->getWallet()?->getId(),
        ]);
    }

    #[Route('/create', name: 'bonos_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $tipoclase = $em->getRepository(TipoClase::class)->find($data['tipoclase_id']);
        $wallet = $em->getRepository(Wallet::class)->find($data['wallet_id']);

        if (!$tipoclase || !$wallet) {
            return $this->json(['error' => 'Relaciones no válidas'], 400);
        }

        $bono = new Bonos();
        $bono->setClasesRestantes($data['clases_restantes']);
        $bono->setClasesTotales($data['clases_totales']);
        $bono->setFecha(new \DateTime($data['fecha']));
        $bono->setEstado($data['estado']);
        $bono->setTipoclase($tipoclase);
        $bono->setWallet($wallet);

        $em->persist($bono);
        $em->flush();

        return $this->json(['message' => 'Bono creado correctamente', 'id' => $bono->getId()], 201);
    }

    #[Route('/update/{id}', name: 'bonos_update', methods: ['PUT'])]
    public function update(Request $request, Bonos $bono, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['clases_restantes'])) {
            $bono->setClasesRestantes($data['clases_restantes']);
        }

        if (isset($data['clases_totales'])) {
            $bono->setClasesTotales($data['clases_totales']);
        }

        if (isset($data['fecha'])) {
            $bono->setFecha(new \DateTime($data['fecha']));
        }

        if (isset($data['estado'])) {
            $bono->setEstado($data['estado']);
        }

        if (isset($data['tipoclase_id'])) {
            $tipoclase = $em->getRepository(TipoClase::class)->find($data['tipoclase_id']);
            if ($tipoclase) $bono->setTipoclase($tipoclase);
        }

        if (isset($data['wallet_id'])) {
            $wallet = $em->getRepository(Wallet::class)->find($data['wallet_id']);
            if ($wallet) $bono->setWallet($wallet);
        }

        $em->flush();

        return $this->json(['message' => 'Bono actualizado correctamente']);
    }

    #[Route('/delete/{id}', name: 'bonos_delete', methods: ['DELETE'])]
    public function delete(Bonos $bono, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($bono);
        $em->flush();

        return $this->json(['message' => 'Bono eliminado correctamente']);
    }
}