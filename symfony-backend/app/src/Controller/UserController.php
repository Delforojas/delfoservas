<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Enum\RoleEnum;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\DBAL\Connection; 
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\Response; 
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;




#[Route('/api/users')]
class UserController extends AbstractController
{
    #[Route('', name: 'users_index', methods: ['GET'])]
public function index(UserRepository $repo): JsonResponse
{
    $users = $repo->findAll();
    $data = [];

    foreach ($users as $user) {
        $data[] = [
            'id'     => $user->getId(),
            'nombre' => $user->getNombre(),
            'email'  => $user->getEmail(),
        ];
    }

   
    return $this->json($data);
}
  #[Route('/me', name: 'users_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'No autenticado'], 401);
        }
/** @var \App\Entity\User $user */

        return $this->json([
            'id'     => $user->getId(),
            'nombre' => $user->getNombre(),
            'email'  => $user->getEmail(),
            'roles'  => $user->getRoles(),
        ]);
    }

   #[Route('/{id}', name: 'users_show', methods: ['GET'], requirements: ['id' => '\d+'])]
public function show(User $user): JsonResponse
{
    return $this->json([
        'id'     => $user->getId(),
        'nombre' => $user->getNombre(),
        'email'  => $user->getEmail(),
    ]);
}
#[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true) ?? [];

       
        if (empty($data['email']) || empty($data['password'])) {
            return $this->json(['error' => 'email y password son obligatorios'], 400);
        }

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
            'nombre'  => $user->getNombre(), 
            'token'   => $jwtManager->create($user)
        ], 201);
    }


#[Route('/{id}', name: 'users_update', methods: ['PUT'], requirements: ['id' => '\d+'])]
public function update(Request $request, User $user, EntityManagerInterface $em): JsonResponse
{
    $data = json_decode($request->getContent(), true);
    $user->setNombre($data['nombre'] ?? $user->getNombre());
    $user->setEmail($data['email'] ?? $user->getEmail());
    $user->setPassword($data['password'] ?? $user->getPassword());
    $em->flush();

    return $this->json(['message' => 'Usuario actualizado']);
}

#[Route('/{id}', name: 'users_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
public function delete(User $user, EntityManagerInterface $em): JsonResponse
{
    $em->remove($user);
    $em->flush();
    return $this->json(['message' => 'Usuario eliminado']);
}

#[Route('/profesores ', name: 'profesores_index', methods: ['GET'])]
public function listarProfesores(UserRepository $repo): JsonResponse
{
    return $this->json($repo->listarProfesores());
}
}