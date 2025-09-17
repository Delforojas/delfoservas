<?php

namespace App\Repository;

use App\Entity\Room;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Room>
 */
class RoomRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Room::class);
    }

    // Puedes añadir aquí métodos personalizados si los necesitas
    /*
    public function findByAforoMayorQue(int $min): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.aforo_sala > :min')
            ->setParameter('min', $min)
            ->orderBy('r.aforo_sala', 'DESC')
            ->getQuery()
            ->getResult();
    }
    */
}