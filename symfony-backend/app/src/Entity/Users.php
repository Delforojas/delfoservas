<?php

namespace App\Entity;

use App\Repository\UsersRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UsersRepository::class)]
class Users implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $nombre = null;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $password = null;

    // Guardas UN rol en texto plano en la DB
    #[ORM\Column(type: 'string', length: 20)]
    private string $roles = 'alumno';

    // --- required por Symfony ---
    public function getUserIdentifier(): string { return $this->email ?? ''; }
    public function getUsername(): string { return $this->getUserIdentifier(); } // compat
    public function getPassword(): string { return $this->password ?? ''; }
    public function eraseCredentials(): void {}
    /**
     * Symfony espera SIEMPRE un array de roles tipo ROLE_*
     */
    public function getRoles(): array
    {
        $map = [
            'admin'    => 'ROLE_ADMIN',
            'profesor' => 'ROLE_TEACHER',
            'alumno'   => 'ROLE_USER',
        ];

        $symRole = $map[strtolower($this->roles)] ?? 'ROLE_USER';

        // añade ROLE_USER como base, y evita duplicados
        return array_values(array_unique([$symRole, 'ROLE_USER']));
    }

    /**
     * Como solo guardas un rol en DB, nos quedamos con el primero que venga.
     */
    public function setRoles(array $roles): self
    {
        // admite ROLE_* o nombres “humanos”
        $reverse = [
            'ROLE_ADMIN'   => 'admin',
            'ROLE_TEACHER' => 'profesor',
            'ROLE_USER'    => 'alumno',
        ];

        $first = $roles[0] ?? 'ROLE_USER';
        $first = strtoupper($first);

        $this->roles = $reverse[$first] ?? strtolower($first); // p.ej. “alumno”

        return $this;
    }
// --- getters/setters que usas en controladores ---
    public function getId(): ?int { return $this->id; }

    public function getNombre(): ?string { return $this->nombre; }
    public function setNombre(?string $nombre): self { $this->nombre = $nombre; return $this; }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(?string $email): self { $this->email = $email; return $this; }

    public function setPassword(?string $password): self { $this->password = $password; return $this; }

}
