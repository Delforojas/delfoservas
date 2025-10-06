<?php

namespace App\Entity;

use App\Repository\ClaseRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClaseRepository::class)]
class Clase
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 100)]
    private ?string $nombre = null;

    #[ORM\ManyToOne(targetEntity: TipoClase::class)]
    #[ORM\JoinColumn(name: 'tipoclase', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?TipoClase $tipoclase = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'teacher_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?User $teacher = null;

    #[ORM\Column(type: 'date')]
    private ?\DateTimeInterface $fecha = null;

    #[ORM\Column(type: 'time')]
    private ?\DateTimeInterface $hora = null;

    #[ORM\Column(type: 'integer')]
    private ?int $aforo_clase = null;

    #[ORM\ManyToOne(targetEntity: Room::class)]
    #[ORM\JoinColumn(name: 'room_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Room $room = null;

    public function getId(): ?int { return $this->id; }

    public function getNombre(): ?string { return $this->nombre; }
    public function setNombre(string $nombre): self { $this->nombre = $nombre; return $this; }

    public function getTipoclase(): ?TipoClase { return $this->tipoclase; }
    public function setTipoclase(?TipoClase $tipoclase): self { $this->tipoclase = $tipoclase; return $this; }

    public function getTeacher(): ?User { return $this->teacher; }
    public function setTeacher(?User $teacher): self { $this->teacher = $teacher; return $this; }

    public function getFecha(): ?\DateTimeInterface { return $this->fecha; }
    public function setFecha(\DateTimeInterface $fecha): self { $this->fecha = $fecha; return $this; }

    public function getHora(): ?\DateTimeInterface { return $this->hora; }
    public function setHora(\DateTimeInterface $hora): self { $this->hora = $hora; return $this; }

    public function getAforoClase(): ?int { return $this->aforo_clase; }
    public function setAforoClase(int $aforo_clase): self { $this->aforo_clase = $aforo_clase; return $this; }

    public function getRoom(): ?Room { return $this->room; }
    public function setRoom(?Room $room): self { $this->room = $room; return $this; }
}