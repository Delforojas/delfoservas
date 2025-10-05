<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;

class VistasRepository
{
   
    public function __construct(private Connection $conn)
    {
    }
            public function vistaBonos(): array
            {
               

                $sql = <<<'SQL'
                    SELECT
                    w.usuario_id       AS usuario_id,
                    u.nombre           AS cliente,
                    tc.nombre          AS tipo_clase,
                    b.clases_totales   AS total_clases,
                    b.clases_restantes AS clases_restantes,
                    b.estado           AS estado,
                    w.mes              AS mes
                    FROM bonos b
                    JOIN wallet w      ON b.wallet_id  = w.id
                    JOIN users u       ON w.usuario_id = u.id
                    JOIN tipo_clase tc ON b.tipoclase  = tc.id
                    ORDER BY b.id
                SQL;

               return $this->conn->fetchAllAssociative($sql);
            }





    public function vistaBonosPorUsuario(int $usuarioId): array
    {
        $sql = '
            SELECT
              w.usuario_id       AS usuario_id,
              u.nombre           AS cliente,
              tc.nombre          AS tipo_clase,
              b.clases_totales   AS total_clases,
              b.clases_restantes AS clases_restantes,
              b.estado           AS estado
            FROM bonos b
            JOIN wallet w      ON b.wallet_id  = w.id
            JOIN "user" u      ON w.usuario_id = u.id
            JOIN tipo_clase tc ON b.tipoclase  = tc.id
            WHERE w.usuario_id = :uid
            ORDER BY b.id
        ';

        return $this->conn->fetchAllAssociative($sql, ['uid' => $usuarioId]); // ✅ usamos $this->conn
    }


            public function getReservasPorUsuario(int $usuarioId): array
            {
               

                $sql = '
        SELECT 
            r.usuario_id       AS id_usuario,
            u.nombre           AS usuario_nombre,
            r.id               AS reserva_id,
            r.clase_id,
            r.bono_id,
            c.nombre           AS clase_nombre,
            c.fecha,
            c.hora,
            tc.nombre          AS tipoclase_nombre,
            b.estado           AS bono_estado
        FROM reservation r
        JOIN "user" u  ON u.id = r.usuario_id       -- 👈 con comillas, tabla real
        JOIN clase c   ON c.id = r.clase_id
        JOIN tipo_clase tc ON tc.id = c.tipoclase
        JOIN bonos b   ON b.id = r.bono_id
        WHERE r.usuario_id = :id
        ORDER BY c.fecha, c.hora
    ';

                 return $this->conn->fetchAllAssociative($sql, ['id' => $usuarioId]);

            }



            public function getWalletPorUsuario(int $usuarioId): array
{
    $sql = '
        SELECT 
            w.usuario_id       AS id_usuario,
            u.id               AS usuario_id,
            u.nombre           AS usuario_nombre,
            u.email            AS usuario_email,
            w.id               AS wallet_id,
            w.tipoclase        AS tipoclase_id,
            tc.nombre          AS tipoclase_nombre,
            w.fecha
        FROM wallet w
        JOIN "user" u   ON u.id = w.usuario_id
        JOIN tipo_clase tc ON tc.id = w.tipoclase
        WHERE w.usuario_id = :id
        ORDER BY w.fecha DESC
    ';

    return $this->conn->fetchAllAssociative($sql, ['id' => $usuarioId]);
}
}



        

        


