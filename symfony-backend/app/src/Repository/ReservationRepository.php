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

       $sql = '
  SELECT
    c.id                                      AS id,
    c.nombre                                  AS nombre,
    c.fecha                                   AS fecha,
    TO_CHAR(c.hora, \'HH24:MI\')              AS hora,
    c.aforo_clase                             AS aforo_clase,
    COALESCE(r.reservas, 0)                   AS reservas_tmp,
    (c.aforo_clase - COALESCE(r.reservas, 0)) AS plazas,
    (COALESCE(r.reservas, 0) >= c.aforo_clase) AS completa,
    tc.nombre                                 AS tipoclase_nombre,
    u.nombre                                  AS profesor,
    c.teacher_id                              AS teacher,
    rm.descripcion                            AS sala,
    c.room_id                                 AS room,
    ru.reservation_id                         AS reservation_id
  FROM clase c
  LEFT JOIN (
    SELECT clase_id, COUNT(*) AS reservas
    FROM reservation
    GROUP BY clase_id
  ) r ON r.clase_id = c.id
  LEFT JOIN tipo_clase tc ON tc.id = c.tipoclase
  LEFT JOIN "user" u      ON u.id  = c.teacher_id
  LEFT JOIN room rm       ON rm.id = c.room_id
  LEFT JOIN LATERAL (
    SELECT r2.id AS reservation_id
    FROM reservation r2
    WHERE r2.clase_id = c.id
      AND current_setting(\'app.user_id\', true) IS NOT NULL
      AND r2.usuario_id = current_setting(\'app.user_id\', true)::int
    LIMIT 1
  ) ru ON TRUE
  WHERE EXTRACT(DOW FROM c.fecha) = 1
  ORDER BY c.fecha, c.hora
';
         // Usamos transacción + SET LOCAL para que SOLO afecte a esta consulta
    return $conn->transactional(function (\Doctrine\DBAL\Connection $c) use ($sql, $userId) {
        // Interpolamos como int para evitar inyección y porque SET LOCAL no acepta bind param en PG
        $c->executeStatement("SET LOCAL app.user_id = " . (int)$userId);
        return $c->fetchAllAssociative($sql);
    });
}
    
    public function martes(int $userId): array
{
    $conn = $this->getEntityManager()->getConnection();

     $sql = '
  SELECT
    c.id                                      AS id,
    c.nombre                                  AS nombre,
    c.fecha                                   AS fecha,
    TO_CHAR(c.hora, \'HH24:MI\')              AS hora,
    c.aforo_clase                             AS aforo_clase,
    COALESCE(r.reservas, 0)                   AS reservas_tmp,
    (c.aforo_clase - COALESCE(r.reservas, 0)) AS plazas,
    (COALESCE(r.reservas, 0) >= c.aforo_clase) AS completa,
    tc.nombre                                 AS tipoclase_nombre,
    u.nombre                                  AS profesor,
    c.teacher_id                              AS teacher,
    rm.descripcion                            AS sala,
    c.room_id                                 AS room,
    ru.reservation_id                         AS reservation_id
  FROM clase c
  LEFT JOIN (
    SELECT clase_id, COUNT(*) AS reservas
    FROM reservation
    GROUP BY clase_id
  ) r ON r.clase_id = c.id
  LEFT JOIN tipo_clase tc ON tc.id = c.tipoclase
  LEFT JOIN "user" u      ON u.id  = c.teacher_id
  LEFT JOIN room rm       ON rm.id = c.room_id
  LEFT JOIN LATERAL (
    SELECT r2.id AS reservation_id
    FROM reservation r2
    WHERE r2.clase_id = c.id
      AND current_setting(\'app.user_id\', true) IS NOT NULL
      AND r2.usuario_id = current_setting(\'app.user_id\', true)::int
    LIMIT 1
  ) ru ON TRUE
  WHERE EXTRACT(DOW FROM c.fecha) = 2
  ORDER BY c.fecha, c.hora
';

    return $conn->transactional(function (\Doctrine\DBAL\Connection $c) use ($sql, $userId) {
        $c->executeStatement("SET LOCAL app.user_id = " . (int)$userId);
        return $c->fetchAllAssociative($sql);
    });
}
    public function miercoles(): array
    {
        $conn = $this->getEntityManager()->getConnection(); // <- AQUÍ la conexión

        $sql = '
  SELECT
    c.id                                      AS id,
    c.nombre                                  AS nombre,
    c.fecha                                   AS fecha,
    TO_CHAR(c.hora, \'HH24:MI\')              AS hora,
    c.aforo_clase                             AS aforo_clase,
    COALESCE(r.reservas, 0)                   AS reservas_tmp,
    (c.aforo_clase - COALESCE(r.reservas, 0)) AS plazas,
    (COALESCE(r.reservas, 0) >= c.aforo_clase) AS completa,
    tc.nombre                                 AS tipoclase_nombre,
    u.nombre                                  AS profesor,
    c.teacher_id                              AS teacher,
    rm.descripcion                            AS sala,
    c.room_id                                 AS room,
    ru.reservation_id                         AS reservation_id
  FROM clase c
  LEFT JOIN (
    SELECT clase_id, COUNT(*) AS reservas
    FROM reservation
    GROUP BY clase_id
  ) r ON r.clase_id = c.id
  LEFT JOIN tipo_clase tc ON tc.id = c.tipoclase
  LEFT JOIN "user" u      ON u.id  = c.teacher_id
  LEFT JOIN room rm       ON rm.id = c.room_id
  LEFT JOIN LATERAL (
    SELECT r2.id AS reservation_id
    FROM reservation r2
    WHERE r2.clase_id = c.id
      AND current_setting(\'app.user_id\', true) IS NOT NULL
      AND r2.usuario_id = current_setting(\'app.user_id\', true)::int
    LIMIT 1
  ) ru ON TRUE
  WHERE EXTRACT(DOW FROM c.fecha) = 3
  ORDER BY c.fecha, c.hora
';

        return $conn->fetchAllAssociative($sql);
    }
    public function jueves(): array
    {
        $conn = $this->getEntityManager()->getConnection(); // <- AQUÍ la conexión

        $sql =  $sql = '
  SELECT
    c.id                                      AS id,
    c.nombre                                  AS nombre,
    c.fecha                                   AS fecha,
    TO_CHAR(c.hora, \'HH24:MI\')              AS hora,
    c.aforo_clase                             AS aforo_clase,
    COALESCE(r.reservas, 0)                   AS reservas_tmp,
    (c.aforo_clase - COALESCE(r.reservas, 0)) AS plazas,
    (COALESCE(r.reservas, 0) >= c.aforo_clase) AS completa,
    tc.nombre                                 AS tipoclase_nombre,
    u.nombre                                  AS profesor,
    c.teacher_id                              AS teacher,
    rm.descripcion                            AS sala,
    c.room_id                                 AS room,
    ru.reservation_id                         AS reservation_id
  FROM clase c
  LEFT JOIN (
    SELECT clase_id, COUNT(*) AS reservas
    FROM reservation
    GROUP BY clase_id
  ) r ON r.clase_id = c.id
  LEFT JOIN tipo_clase tc ON tc.id = c.tipoclase
  LEFT JOIN "user" u      ON u.id  = c.teacher_id
  LEFT JOIN room rm       ON rm.id = c.room_id
  LEFT JOIN LATERAL (
    SELECT r2.id AS reservation_id
    FROM reservation r2
    WHERE r2.clase_id = c.id
      AND current_setting(\'app.user_id\', true) IS NOT NULL
      AND r2.usuario_id = current_setting(\'app.user_id\', true)::int
    LIMIT 1
  ) ru ON TRUE
  WHERE EXTRACT(DOW FROM c.fecha) = 4
  ORDER BY c.fecha, c.hora
';

        return $conn->fetchAllAssociative($sql);
    }
     public function viernes(): array
    {
        $conn = $this->getEntityManager()->getConnection(); // <- AQUÍ la conexión

         $sql = '
  SELECT
    c.id                                      AS id,
    c.nombre                                  AS nombre,
    c.fecha                                   AS fecha,
    TO_CHAR(c.hora, \'HH24:MI\')              AS hora,
    c.aforo_clase                             AS aforo_clase,
    COALESCE(r.reservas, 0)                   AS reservas_tmp,
    (c.aforo_clase - COALESCE(r.reservas, 0)) AS plazas,
    (COALESCE(r.reservas, 0) >= c.aforo_clase) AS completa,
    tc.nombre                                 AS tipoclase_nombre,
    u.nombre                                  AS profesor,
    c.teacher_id                              AS teacher,
    rm.descripcion                            AS sala,
    c.room_id                                 AS room,
    ru.reservation_id                         AS reservation_id
  FROM clase c
  LEFT JOIN (
    SELECT clase_id, COUNT(*) AS reservas
    FROM reservation
    GROUP BY clase_id
  ) r ON r.clase_id = c.id
  LEFT JOIN tipo_clase tc ON tc.id = c.tipoclase
  LEFT JOIN "user" u      ON u.id  = c.teacher_id
  LEFT JOIN room rm       ON rm.id = c.room_id
  LEFT JOIN LATERAL (
    SELECT r2.id AS reservation_id
    FROM reservation r2
    WHERE r2.clase_id = c.id
      AND current_setting(\'app.user_id\', true) IS NOT NULL
      AND r2.usuario_id = current_setting(\'app.user_id\', true)::int
    LIMIT 1
  ) ru ON TRUE
  WHERE EXTRACT(DOW FROM c.fecha) = 5
  ORDER BY c.fecha, c.hora
';

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