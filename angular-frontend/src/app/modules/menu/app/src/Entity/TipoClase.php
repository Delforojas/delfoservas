<?php

namespace App\Entity;

use App\Repository\TipoClaseRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TipoClaseRepository::class)]
#[ORM\Table(name: 'tipo_clase')]
class TipoClase
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 100)]
    private ?string $nombre = null;

    #[ORM\Column(type: 'float')]
    private ?float $clases_totales = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private ?string $precio = null;


    // Getters y setters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): self
    {
        $this->nombre = $nombre;
        return $this;
    }

    public function getClasesTotales(): ?float
    {
        return $this->clases_totales;
    }

    public function setClasesTotales(float $clases_totales): self
    {
        $this->clases_totales = $clases_totales;
        return $this;
    }
    public function getPrecio(): ?float
    {
        return $this->precio;
    }

    public function setPrecio(float $precio): self
    {
        $this->precio = $precio;
        return $this;
    }
}