<?php

namespace App\Controller;

use App\Entity\Users;
use App\Repository\UsersRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\DBAL\Connection; 
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\Response;    

#[Route('/api/users')]
class UsersController extends AbstractController
{
    #[Route('', name: 'users_index', methods: ['GET'])]
public function index(UsersRepository $repo): JsonResponse
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

    // 👇 IMPORTANTE: devolver SIEMPRE la respuesta
    return $this->json($data);
}
  #[Route('/me', name: 'users_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        return $this->json([
            'id'     => $user->getId(),
            'nombre' => $user->getNombre(),
            'email'  => $user->getEmail(),
            'roles'  => $user->getRoles(),
        ]);
    }

   #[Route('/{id}', name: 'users_show', methods: ['GET'], requirements: ['id' => '\d+'])]
public function show(Users $user): JsonResponse
{
    return $this->json([
        'id'     => $user->getId(),
        'nombre' => $user->getNombre(),
        'email'  => $user->getEmail(),
    ]);
}

#[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $req,
        EntityManagerInterface $em,
        UsersRepository $repo,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $d = json_decode($req->getContent(), true) ?? [];

        $email = trim($d['email'] ?? '');
        $nombre = trim($d['nombre'] ?? '');
        $plain = (string) ($d['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Email inválido'], Response::HTTP_BAD_REQUEST);
        }
        if (strlen($plain) < 8) {
            return $this->json(['error' => 'La contraseña debe tener al menos 8 caracteres'], Response::HTTP_BAD_REQUEST);
        }
        if ($repo->findOneBy(['email' => $email])) {
            return $this->json(['error' => 'El email ya existe'], Response::HTTP_CONFLICT);
        }

        $u = new Users();
        $u->setEmail($email);
        $u->setNombre($nombre);
        $u->setRoles(['ROLE_USER']);
        $u->setPassword($hasher->hashPassword($u, $plain));

        $em->persist($u);
        $em->flush();

        return $this->json(['message' => 'Registrado', 'id' => $u->getId()], Response::HTTP_CREATED);
    }


#[Route('/{id}', name: 'users_update', methods: ['PUT'], requirements: ['id' => '\d+'])]
public function update(Request $request, Users $user, EntityManagerInterface $em): JsonResponse
{
    $data = json_decode($request->getContent(), true);
    $user->setNombre($data['nombre'] ?? $user->getNombre());
    $user->setEmail($data['email'] ?? $user->getEmail());
    $user->setPassword($data['password'] ?? $user->getPassword());
    $em->flush();

    return $this->json(['message' => 'Usuario actualizado']);
}

#[Route('/delete/{id}', name: 'users_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
public function delete(Users $user, EntityManagerInterface $em): JsonResponse
{
    $em->remove($user);
    $em->flush();
    return $this->json(['message' => 'Usuario eliminado']);
}

    #[Route('/profesores', name: 'profesores_index', methods: ['GET'])]
    public function listarProfesores(UsersRepository $repo): JsonResponse
    {
        return $this->json($repo->listarProfesores());
    }
}