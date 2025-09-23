<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_')]
final class AuthController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true) ?? [];

        // Validaciones básicas
        if (empty($data['email']) || empty($data['password'])) {
            return $this->json(['error' => 'email y password son obligatorios'], 400);
        }

        // Evitar duplicados de email
        $existing = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existing) {
            return $this->json(['error' => 'El email ya está en uso'], 409);
        }

        $user = new User();
        $user->setNombre(isset($data['nombre']) ? trim((string)$data['nombre']) : '');
        $user->setEmail($data['email']);
        $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
        $user->setRole(RoleEnum::USER);

        $em->persist($user);
        $em->flush();

        return $this->json([
            'message' => 'Usuario registrado correctamente',
            'id'      => $user->getId(),
            'nombre'  => $user->getNombre(), // <-- añadir para verificar
            'token'   => $jwtManager->create($user)
        ], 201);
    }
}