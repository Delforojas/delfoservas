<?php

namespace App\Repository;

use App\Entity\Bonos;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Bonos>
 */
class BonosRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Bonos::class);
    }

    // Ejemplo de método personalizado opcional:
    /*
    public function findByEstado(string $estado): array
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.estado = :estado')
            ->setParameter('estado', $estado)
            ->getQuery()
            ->getResult();
    }
    */
}