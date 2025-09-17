<?php

namespace App\Repository;

use App\Entity\Wallet;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Wallet>
 */
class WalletRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Wallet::class);
    }

    // Ejemplo de método personalizado (puedes eliminarlo si no lo necesitas)
    /*
    public function findByUsuarioId(int $usuarioId): array
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.usuario = :usuarioId')
            ->setParameter('usuarioId', $usuarioId)
            ->orderBy('w.fecha', 'DESC')
            ->getQuery()
            ->getResult();
    }
    */
}