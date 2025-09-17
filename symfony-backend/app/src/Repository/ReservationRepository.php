<?php

// src/Repository/ReservationRepository.php
namespace App\Repository;



use App\Entity\Bonos;
use App\Entity\Reservation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\DBAL\Connection;

class ReservationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reservation::class);
    }

   
    public function lunes(int $userId): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            SELECT *
            FROM vista_clases_con_reserva
            WHERE dia = 'Lunes'
            ORDER BY fecha, hora
        ";
        return $conn->fetchAllAssociative($sql, ['uid' => $userId]);
    }
    
    public function martes(): array
    {
        $conn = $this->getEntityManager()->getConnection(); // <- AQUÍ la conexión

        $sql = "
            SELECT *
            FROM vista_clases_con_reserva
            WHERE dia = 'Martes'
            ORDER BY fecha, hora
        ";

        return $conn->fetchAllAssociative($sql);
    }
    public function miercoles(): array
    {
        $conn = $this->getEntityManager()->getConnection(); // <- AQUÍ la conexión

        $sql = "
            SELECT *
            FROM vista_clases_con_reserva
            WHERE dia = 'Miércoles'
            ORDER BY fecha, hora
        ";

        return $conn->fetchAllAssociative($sql);
    }
    public function jueves(): array
    {
        $conn = $this->getEntityManager()->getConnection(); // <- AQUÍ la conexión

        $sql = "
            SELECT *
            FROM vista_clases_con_reserva
            WHERE dia = 'Jueves'
            ORDER BY fecha, hora
        ";

        return $conn->fetchAllAssociative($sql);
    }
     public function viernes(): array
    {
        $conn = $this->getEntityManager()->getConnection(); // <- AQUÍ la conexión

        $sql = "
            SELECT *
            FROM vista_clases_con_reserva
            WHERE dia = 'Viernes'
            ORDER BY fecha, hora
        ";

        return $conn->fetchAllAssociative($sql);
    }

    public function getBonoActivoDeUsuario(int $usuarioId, int $tipoId): ?array
    {
        $conn = $this->getEntityManager()->getConnection(); // <- usar EM, no $this->conn
        $sql = "
            SELECT *
            FROM vista_usuarios_bonos_activos
            WHERE usuario_id = :uid AND tipoclase = :tipo
            ORDER BY bono_id
            LIMIT 1
        ";
        $row = $conn->fetchAssociative($sql, ['uid' => $usuarioId, 'tipo' => $tipoId]);
        return $row ?: null;
    }
}