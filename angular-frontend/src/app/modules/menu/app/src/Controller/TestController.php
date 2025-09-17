<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class TestController extends AbstractController
{
    #[Route('/test/tables', name: 'test_tables')]
    public function listTables(Connection $connection): JsonResponse
    {
        $result = $connection->executeQuery("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
        $tables = $result->fetchAllAssociative();

        return $this->json($tables);
    }
}