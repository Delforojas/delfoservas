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

use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;






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
            'avatar' => $user->getProfileImage(),
        ];
    }

   
    return $this->json($data);
}
#[Route('/me', name: 'user_me', methods: ['GET'])]
public function me(Request $request): JsonResponse
{
    $user = $this->getUser();

    if (!$user) {
        return $this->json(['error' => 'No autenticado'], 401);
    }

    $imagePath = $user->getProfileImage();

    if ($imagePath) {
    // Si no contiene "avatars/", lo añadimos
    if (!str_contains($imagePath, 'avatars/')) {
        $imagePath = 'avatars/' . $imagePath;
    }
    $avatarUrl = $request->getSchemeAndHttpHost() . '/uploads/' . $imagePath;
} else {
    // ⚡ No devolvemos URL de backend, devolvemos null
    $avatarUrl = null;
}

    return $this->json([
        'id'     => $user->getId(),
        'nombre' => $user->getNombre(),
        'email'  => $user->getEmail(),
        'roles'  => $user->getRoles(),
        'avatar' => $avatarUrl,
    ]);
}
   #[Route('/{id}', name: 'users_show', methods: ['GET'], requirements: ['id' => '\d+'])]
public function show(User $user): JsonResponse
{
    return $this->json([
        'id'     => $user->getId(),
        'nombre' => $user->getNombre(),
        'email'  => $user->getEmail(),
        'avatar' => $user->getProfileImage(),

    ]);
}
#[Route('/register', name: 'user_register', methods: ['POST'])]
public function register(
    Request $request,
    UserPasswordHasherInterface $passwordHasher,
    EntityManagerInterface $em,
    JWTTokenManagerInterface $jwtManager
): JsonResponse {
    $nombre   = $request->request->get('nombre');
    $email    = $request->request->get('email');
    $password = $request->request->get('password');
    /** @var UploadedFile|null $imageFile */
    $imageFile = $request->files->get('avatar');

    if (empty($email) || empty($password)) {
        return $this->json(['error' => 'Email y contraseña son obligatorios'], 400);
    }

    if ($em->getRepository(User::class)->findOneBy(['email' => $email])) {
        return $this->json(['error' => 'El email ya está en uso'], 409);
    }

    $user = new User();
    $user->setNombre($nombre);
    $user->setEmail($email);
    $user->setPassword($passwordHasher->hashPassword($user, $password));
    $user->setRole(RoleEnum::USER);

    if ($imageFile) {
        $fileName = uniqid('pf_', true) . '.' . $imageFile->guessExtension();
        $imageFile->move(
            $this->getParameter('uploads_directory') . '/avatars',
            $fileName
        );
        $user->setProfileImage('avatars/' . $fileName);
    }

    $em->persist($user);
    $em->flush();

    $token = $jwtManager->create($user);

    return $this->json([
        'message' => 'Usuario creado correctamente',
        'token'   => $token,
        'user'    => [
            'id'     => $user->getId(),
            'nombre' => $user->getNombre(),
            'email'  => $user->getEmail(),
            'roles'  => $user->getRoles(),
            'avatar' => $user->getProfileImage()
                ? 'uploads/avatars/' . $user->getProfileImage()
                : null,
        ],
    ], 201);
}

#[Route('/{id}', name: 'users_update', methods: ['PUT'], requirements: ['id' => '\d+'])]
public function update(
    Request $request,
    User $user,
    EntityManagerInterface $em,
    UserPasswordHasherInterface $passwordHasher
): JsonResponse {
    // 1) Decodificar JSON con control de errores
    $raw = $request->getContent();
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return $this->json(['error' => 'JSON inválido'], Response::HTTP_BAD_REQUEST);
    }

    // 2) Saneado y updates parciales
    if (array_key_exists('nombre', $data)) {
        $user->setNombre(isset($data['nombre']) ? trim((string)$data['nombre']) : null);
    }

    if (array_key_exists('email', $data)) {
        $newEmail = mb_strtolower(trim((string)$data['email']));
        if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'email no válido'], 400);
        }
        // Comprobar unicidad si cambia
        if ($newEmail !== $user->getEmail()) {
            $exists = $em->getRepository(User::class)->findOneBy(['email' => $newEmail]);
            if ($exists) {
                return $this->json(['error' => 'El email ya está en uso'], 409);
            }
            $user->setEmail($newEmail);
        }
    }

    if (!empty($data['password'])) {
        $hashed = $passwordHasher->hashPassword($user, (string)$data['password']);
        $user->setPassword($hashed);
    }

    if (array_key_exists('profile_image', $data)) {
        $pi = $data['profile_image'];
        $user->setProfileImage($pi !== null ? (string)$pi : null);
    }

    try {
        $em->flush();
    } catch (UniqueConstraintViolationException $e) {
        return $this->json(['error' => 'Conflicto de unicidad'], 409);
    }

    // construir salida (usa tu helper si lo tienes)
    $avatar = method_exists($user, 'getProfileImageUrl')
    ? $user->getProfileImageUrl()
    : $user->getProfileImage();

return $this->json([
    'message' => 'Usuario actualizado',
    'user' => [
        'id'      => $user->getId(),
        'nombre'  => $user->getNombre(),
        'email'   => $user->getEmail(),
        'roles'   => $user->getRoles(),
        'avatar'  => $avatar, // 👈 unificado con el registro
    ],
]);
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