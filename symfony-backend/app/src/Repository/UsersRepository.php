<?php

namespace App\Repository;

use App\Entity\Users;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Users>
 */
class UsersRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Users::class);
    }

    public function listarProfesores(): array
    {
        $conn = $this->getEntityManager()->getConnection();
        $sql = "
            SELECT id, nombre, email
            FROM users
            WHERE roles IN ('profesor', 'admin')
            ORDER BY nombre
        ";
        return $conn->fetchAllAssociative($sql);
    }

    // Aquí puedes añadir consultas personalizadas si las necesitas, por ejemplo:
    /*
    public function findByEmail(string $email): ?Users
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }
    */
}