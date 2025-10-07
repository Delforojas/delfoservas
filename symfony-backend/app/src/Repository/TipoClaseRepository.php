<?php

namespace App\Repository;

use App\Entity\TipoClase;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TipoClase>
 */
class TipoClaseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TipoClase::class);
    }

    // Ejemplo de método personalizado opcional:
    /*
    public function findByNombre(string $nombre): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.nombre = :nombre')
            ->setParameter('nombre', $nombre)
            ->getQuery()
            ->getResult();
    }
    */
}