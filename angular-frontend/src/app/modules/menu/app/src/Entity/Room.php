<?php

namespace App\Entity;

use App\Repository\RoomRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RoomRepository::class)]
class Room
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $descripcion = null;

    #[ORM\Column(type: 'integer')]
    private ?int $aforo_sala = null;

    // Getters y setters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion): self
    {
        $this->descripcion = $descripcion;
        return $this;
    }

    public function getAforoSala(): ?int
    {
        return $this->aforo_sala;
    }

    public function setAforoSala(int $aforo_sala): self
    {
        $this->aforo_sala = $aforo_sala;
        return $this;
    }
}