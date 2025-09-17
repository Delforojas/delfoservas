<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/test')]
class TestController extends AbstractController
{
    #[Route('', name: 'api_test_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json([
            'status' => 'ok',
            'message' => 'El backend responde correctamente 🎉',
            'ts' => date('c'),
        ]);
    }
}