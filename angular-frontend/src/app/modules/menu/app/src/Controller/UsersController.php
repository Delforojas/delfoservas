<?php

namespace App\Controller;

use App\Entity\Users;
use App\Repository\UsersRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/users')]
class UsersController extends AbstractController
{
    #[Route('', name: 'users_index', methods: ['GET'])]
    public function index(UsersRepository $repo): JsonResponse
    {
        $users = $repo->findAll();

        $data = array_map(fn(Users $u) => [
            'id'     => $u->getId(),
            'nombre' => $u->getNombre(),
            'email'  => $u->getEmail(),
        ], $users);

        return $this->json($data);
    }

    // Quién soy (token JWT requerido)
    #[Route('/me', name: 'users_me', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function me(): JsonResponse
    {
        /** @var Users $u */
        $u = $this->getUser();

        return $this->json([
            'id'     => $u->getId(),
            'nombre' => $u->getNombre(),
            'email'  => $u->getEmail(), 
            'rol'    => $u->getRol(),    
            'roles'  => $u->getRoles(),
        ]);
    }

    #[Route('/{id}', name: 'users_show', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function show(Users $user): JsonResponse
    {
        return $this->json([
            'id'     => $user->getId(),
            'nombre' => $user->getNombre(),
            'rol'    => $user->getRol(),   
            'email'  => $user->getEmail(),
        ]);
    }

    #[Route('/{id}', name: 'users_update', requirements: ['id' => '\d+'], methods: ['PUT','PATCH'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function update(
        Request $request,
        Users $user,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'JSON inválido'], 400);
        }

        if (array_key_exists('nombre', $data)) {
            $user->setNombre($data['nombre'] ?? $user->getNombre());
        }

        if (array_key_exists('email', $data)) {
            $newEmail = $data['email'];
            if ($newEmail !== null && $newEmail !== $user->getEmail()) {
                $existing = $em->getRepository(Users::class)->findOneBy(['email' => $newEmail]);
                if ($existing && $existing->getId() !== $user->getId()) {
                    return $this->json(['error' => 'El email ya está en uso'], 409);
                }
                $user->setEmail($newEmail);
            }
        }

        if (!empty($data['password'])) {
            $user->setPassword($hasher->hashPassword($user, $data['password']));
        }

        $em->flush();
        return $this->json(['message' => 'Usuario actualizado correctamente'], 200);
    }

    #[Route('/{id}', name: 'users_delete', requirements: ['id' => '\d+'], methods: ['DELETE'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function delete(Users $user, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($user);
        $em->flush();
        return new JsonResponse(null, 204); // No Content
    }
    #[Route('/profesores', name: 'profesores_index', methods: ['GET'])]
public function profesores(EntityManagerInterface $em): JsonResponse
{
    $rows = $em->getConnection()
               ->executeQuery('SELECT * FROM vista_profesores ORDER BY nombre')
               ->fetchAllAssociative();

    return $this->json($rows);
}
}