<?php
namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
final class HealthController extends AbstractController {
    #[Route('/_tuputamadre', name: 'api_version', methods: ['GET'])]
    public function version(): JsonResponse {
        return $this->json(['version' => 'BACKEND CORRECTO', 'ts' => date('c')]);
    }
}