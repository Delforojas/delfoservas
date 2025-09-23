<?php

namespace App\Entity;

use App\Repository\ReservationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
#[ORM\Table(name: 'reservation')]
class Reservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    // FK a users
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'usuario_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?User $usuario = null;

    // FK a clase
    #[ORM\ManyToOne(targetEntity: Clase::class)]
    #[ORM\JoinColumn(name: 'clase_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Clase $clase = null;

    // FK a bonos
    #[ORM\ManyToOne(targetEntity: Bonos::class)]
    #[ORM\JoinColumn(name: 'bono_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Bonos $bono = null;

    // Getters y setters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsuario(): ?User
    {
        return $this->usuario;
    }

    public function setUsuario(?User $usuario): self
    {
        $this->usuario = $usuario;
        return $this;
    }

    public function getClase(): ?Clase
    {
        return $this->clase;
    }

    public function setClase(?Clase $clase): self
    {
        $this->clase = $clase;
        return $this;
    }

    public function getBono(): ?Bonos
    {
        return $this->bono;
    }

    public function setBono(?Bonos $bono): self
    {
        $this->bono = $bono;
        return $this;
    }
}