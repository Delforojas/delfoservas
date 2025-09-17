<?php

namespace App\Entity;

use App\Repository\UsersRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UsersRepository::class)]
#[ORM\Table(name: 'users')]
#[ORM\UniqueConstraint(name: 'uniq_users_email', columns: ['email'])]
class Users implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $nombre = null;

    #[ORM\Column(type: 'string', length: 180)]
    private ?string $email = null;

    #[ORM\Column(type: 'string')]
    private ?string $password = null;

   #[ORM\Column(type: 'string', length: 20, options: ['default' => 'alumno'])]
    private string $roles = 'alumno'; 


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(?string $nombre): self
    {
        $this->nombre = $nombre;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = strtolower(trim($email));
        return $this;
    }

    /** Identificador de login */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /** @deprecated usar getUserIdentifier() */
    public function getUsername(): string
    {
        return $this->getUserIdentifier();
    }

    /** Roles de Symfony */
  public function getRoles(): array
{
    // Traducimos el valor string almacenado a los roles que Symfony espera
    return match ($this->roles) {
        'admin'    => ['ROLE_ADMIN'],
        'profesor' => ['ROLE_TEACHER'],
        default    => ['ROLE_USER'],
    };
}   
public function setRoles(string|array $rol): self
{
    if (is_array($rol)) {
        if (in_array('ROLE_ADMIN', $rol, true)) {
            $this->roles = 'admin';
        } elseif (in_array('ROLE_TEACHER', $rol, true)) {
            $this->roles = 'profesor';
        } else {
            $this->roles = 'alumno';
        }
    } elseif (is_string($rol)) {
        $rol = strtolower($rol); // por si viene en mayúsculas
        if (!in_array($rol, ['admin', 'profesor', 'alumno'], true)) {
            throw new \InvalidArgumentException('Rol inválido');
        }
        $this->roles = $rol;
    } else {
        throw new \InvalidArgumentException('Formato de rol no soportado');
    }

    return $this;
}
    public function getRol(): string
    {
        return $this->roles; // aquí es el valor 'admin', 'profesor' o 'alumno'
    }

    /** Password hasheado */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    /** No usamos salt con algoritmos modernos */
    public function eraseCredentials(): void
    {
        // Si guardases un plainPassword temporal, límpialo aquí.
        // $this->plainPassword = null;
    }
}