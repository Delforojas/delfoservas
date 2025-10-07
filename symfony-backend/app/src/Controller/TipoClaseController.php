<?php

namespace App\Controller;

use App\Entity\TipoClase;
use App\Repository\TipoClaseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/tipoclase')]
class TipoClaseController extends AbstractController
{
    #[Route('', name: 'tipoclase_index', methods: ['GET'])]
    public function index(TipoClaseRepository $repo): JsonResponse
    {
        $tipos = $repo->findAll();
        $data = [];

        foreach ($tipos as $tipo) {
            $data[] = [
                'id' => $tipo->getId(),
                'nombre' => $tipo->getNombre(),
                'clases_totales' => $tipo->getClasesTotales(),
            ];
        }

        return $this->json($data);
    }

}