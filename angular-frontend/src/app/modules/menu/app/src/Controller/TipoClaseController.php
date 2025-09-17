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
                'precio'=>$tipo->getPrecio(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'tipoclase_show', methods: ['GET'])]
    public function show(TipoClase $tipo): JsonResponse
    {
        return $this->json([
            'id' => $tipo->getId(),
            'nombre' => $tipo->getNombre(),
            'clases_totales' => $tipo->getClasesTotales(),
        ]);
    }

    #[Route('', name: 'tipoclase_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $tipo = new TipoClase();
        $tipo->setNombre($data['nombre'] ?? '');
        $tipo->setClasesTotales($data['clases_totales'] ?? 0);

        $em->persist($tipo);
        $em->flush();

        return $this->json(['message' => 'Tipo de clase creado correctamente', 'id' => $tipo->getId()], 201);
    }

    #[Route('/{id}', name: 'tipoclase_update', methods: ['PUT'])]
    public function update(Request $request, TipoClase $tipo, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $tipo->setNombre($data['nombre'] ?? $tipo->getNombre());
        $tipo->setClasesTotales($data['clases_totales'] ?? $tipo->getClasesTotales());

        $em->flush();

        return $this->json(['message' => 'Tipo de clase actualizado correctamente']);
    }

    #[Route('/{id}', name: 'tipoclase_delete', methods: ['DELETE'])]
    public function delete(TipoClase $tipo, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($tipo);
        $em->flush();

        return $this->json(['message' => 'Tipo de clase eliminado']);
    }
}