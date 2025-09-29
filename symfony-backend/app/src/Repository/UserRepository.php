<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function listarProfesores(): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
            SELECT id, "nombre", email
            FROM "user"
            WHERE role = :rol
            ORDER BY "nombre"
        ';

        return $conn->fetchAllAssociative($sql, [
            'rol' => 'ROLE_TEACHER',
        ]);
    }

    // Aquí puedes añadir consultas personalizadas si las necesitas, por ejemplo:
    /*
    public function findByEmail(string $email): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }
    */
}