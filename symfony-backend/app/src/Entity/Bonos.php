<?php

namespace App\Entity;

use App\Repository\BonosRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BonosRepository::class)]
class Bonos
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $clasesRestantes = null;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $clasesTotales = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $fecha = null;

    #[ORM\Column(type: Types::STRING, length: 50)]
    private ?string $estado = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'tipoclase', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?TipoClase $tipoclase = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'wallet_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Wallet $wallet = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getClasesRestantes(): ?int
    {
        return $this->clasesRestantes;
    }

    public function setClasesRestantes(int $clasesRestantes): self
    {
        $this->clasesRestantes = $clasesRestantes;
        return $this;
    }

    public function getClasesTotales(): ?int
    {
        return $this->clasesTotales;
    }

    public function setClasesTotales(int $clasesTotales): self
    {
        $this->clasesTotales = $clasesTotales;
        return $this;
    }

    public function getFecha(): ?\DateTimeInterface
    {
        return $this->fecha;
    }

    public function setFecha(\DateTimeInterface $fecha): self
    {
        $this->fecha = $fecha;
        return $this;
    }

    public function getEstado(): ?string
    {
        return $this->estado;
    }

    public function setEstado(string $estado): self
    {
        $this->estado = $estado;
        return $this;
    }

    public function getTipoclase(): ?TipoClase
    {
        return $this->tipoclase;
    }

    public function setTipoclase(?TipoClase $tipoclase): self
    {
        $this->tipoclase = $tipoclase;
        return $this;
    }

    public function getWallet(): ?Wallet
    {
        return $this->wallet;
    }

    public function setWallet(?Wallet $wallet): self
    {
        $this->wallet = $wallet;
        return $this;
    }
}