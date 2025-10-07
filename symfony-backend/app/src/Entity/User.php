<?php

namespace App\Entity;

use App\Repository\UserRepository;
use App\Entity\Enum\RoleEnum;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\HasLifecycleCallbacks]
class User implements UserInterface, PasswordAuthenticatedUserInterface
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

    #[ORM\Column(type: 'string', enumType: RoleEnum::class)]
    private RoleEnum $role = RoleEnum::USER;


     public function getId(): ?int { return $this->id; }
   
    public function getUserIdentifier(): string { return $this->email ?? ''; }

    public function getNombre(): ?string { return $this->nombre; }
    public function setNombre(?string $nombre): self { $this->nombre = $nombre; return $this; }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(?string $email): self { $this->email = $email; return $this; }

    public function getUsername(): string { return $this->getUserIdentifier(); } 
    public function setUserName(string $username): static { $this->username = $username; return $this; }

    public function getPassword(): string { return $this->password ?? ''; }
    public function setPassword(?string $password): self { $this->password = $password; return $this; }

    public function eraseCredentials(): void {}
   
    public function setRole(RoleEnum $role): static{$this->role = $role;                 return $this;}

    public function getRoles(): array{return [$this->role->value];}
   

    
}
