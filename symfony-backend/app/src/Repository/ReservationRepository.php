<?php

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
    /**
     * Devuelve clases filtradas por día de la semana (Postgres: 0=Sunday ... 6=Saturday).
     */
    public function byDayOfWeek(int $dayOfWeek, int $userId): array
    {
        if ($dayOfWeek < 0 || $dayOfWeek > 6) {
            throw new \InvalidArgumentException('dayOfWeek must be between 0 and 6');
        }

        $conn = $this->getEntityManager()->getConnection();

        $sql = <<<SQL
            SELECT
              c.id                                      AS id,
              c.nombre                                  AS nombre,
              c.fecha                                   AS fecha,
              TO_CHAR(c.hora, 'HH24:MI')                AS hora,
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
                AND current_setting('app.user_id', true) IS NOT NULL
                AND r2.usuario_id = current_setting('app.user_id', true)::int
              LIMIT 1
            ) ru ON TRUE
            WHERE (EXTRACT(DOW FROM c.fecha))::int = :dayOfWeek
            ORDER BY c.fecha, c.hora
            SQL;

        return $conn->transactional(function (\Doctrine\DBAL\Connection $c) use ($sql, $userId, $dayOfWeek) {
            $c->executeStatement('SET LOCAL app.user_id = ' . (int)$userId);
            return $c->fetchAllAssociative($sql, ['dayOfWeek' => $dayOfWeek], ['dayOfWeek' => \PDO::PARAM_INT]);
        });
      }

    // Métodos azucarados (helpers)
    public function monday(int $userId): array    { return $this->byDayOfWeek(1, $userId); }
    public function tuesday(int $userId): array   { return $this->byDayOfWeek(2, $userId); }
    public function wednesday(int $userId): array { return $this->byDayOfWeek(3, $userId); }
    public function thursday(int $userId): array  { return $this->byDayOfWeek(4, $userId); }
    public function friday(int $userId): array    { return $this->byDayOfWeek(5, $userId); }


    public function getBonoActivoDeUsuario(int $usuarioId, int $tipoId): ?array
    {
        $conn = $this->getEntityManager()->getConnection(); 
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