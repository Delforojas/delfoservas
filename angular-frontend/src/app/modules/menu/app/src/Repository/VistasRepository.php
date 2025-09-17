<?php

namespace App\Repository;

use Doctrine\ORM\EntityManagerInterface;

class VistasRepository
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function getClasesPorUsuario(int $usuarioId): array
    {
        $conn = $this->em->getConnection();

        $sql = 'SELECT * 
                FROM clases_por_usuario 
                WHERE usuario_id = :id
                ORDER BY fecha, hora';

        $stmt = $conn->prepare($sql);
        $resultSet = $stmt->executeQuery(['id' => $usuarioId]);

        return $resultSet->fetchAllAssociative();
    }
    public function getReservasPorUsuario(int $usuarioId): array
    {
        $conn = $this->em->getConnection();

        $sql = 'SELECT * 
                FROM reservas_por_usuario 
                WHERE id_usuario = :id
                ORDER BY fecha, hora';

        $stmt = $conn->prepare($sql);
        $resultSet = $stmt->executeQuery(['id' => $usuarioId]);

        return $resultSet->fetchAllAssociative();

    }
     public function getWalletPorUsuario(int $usuarioId): array
    {
        $conn = $this->em->getConnection();

        $sql = 'SELECT * 
                FROM vista_wallet_usuario 
                WHERE id_usuario = :id
                ORDER BY mes DESC';

        $stmt = $conn->prepare($sql);
        return $stmt->executeQuery(['id' => $usuarioId])->fetchAllAssociative();
    }
     public function getBonosPorUsuario(int $usuarioId): array
    {
        $conn = $this->em->getConnection();
        $sql = 'SELECT * 
                FROM vista_bonos_usuario 
                WHERE id_usuario = :id
                ORDER BY bono_id';
        return $conn->prepare($sql)->executeQuery(['id' => $usuarioId])->fetchAllAssociative();
    }
    public function getAlumnosPorClase(int $claseId): array
{
    $sql = 'SELECT * 
            FROM vista_alumnos_por_clase 
            WHERE clase_id = :id
            ORDER BY alumno_nombre';
    return $this->em->getConnection()->prepare($sql)->executeQuery(['id' => $claseId])->fetchAllAssociative();
}

public function getTotalAlumnosPorClase(int $claseId): array
{
    $sql = 'SELECT DISTINCT clase_id, clase_nombre AS clase, fecha , hora ,tipo_clase AS tipoclase, total_alumnos 
            FROM vista_alumnos_por_clase 
            WHERE clase_id = :id';
    return $this->em->getConnection()->prepare($sql)->executeQuery(['id' => $claseId])->fetchAllAssociative();
}



//USUARIOS
public function getWalletUsuario(int $usuarioId): array
{
    $sql = <<<SQL
        SELECT 
            id_usuario,
            usuario_nombre,
            usuario_email,
            wallet_id,
            tipoclase_id,
            tipoclase_nombre,
            tipoclase_precio,
            mes
        FROM vista_wallet_usuario
        WHERE id_usuario = :id
        ORDER BY mes DESC
    SQL;

    return $this->em->getConnection()
        ->prepare($sql)
        ->executeQuery(['id' => $usuarioId])
        ->fetchAllAssociative();
}

public function getWalletUsuarioAll(): array
{
    $sql = "SELECT * FROM vista_wallet_usuario ORDER BY mes DESC";

    return $this->em->getConnection()
        ->executeQuery($sql)
        ->fetchAllAssociative();
}



// MESES
public function getWalletMes(string $mes): array
{
    $sql = <<<SQL
        SELECT *
        FROM vista_wallet_usuario
        WHERE LOWER(TO_CHAR(fecha, 'FMMonth')) = LOWER(:mes)
        ORDER BY fecha DESC
    SQL;

    return $this->em->getConnection()
        ->executeQuery($sql, ['mes' => $mes])
        ->fetchAllAssociative();
}


// Tipo CLASES 
public function getWalletPorTipoClase(int $id): array
{
    $sql = "SELECT * FROM vista_wallet_usuario WHERE tipoclase_id = :id ORDER BY fecha DESC";
    return $this->em->getConnection()
        ->executeQuery($sql, ['id' => $id])
        ->fetchAllAssociative();
} 
public function getWalletPorMesYTipo(string $mes, int $tipoId): array
{
    $sql = <<<SQL
      SELECT *
      FROM vista_wallet_usuario
      WHERE TO_CHAR(fecha, 'YYYY-MM') = :mes
        AND tipoclase_id = :tipo
      ORDER BY fecha DESC, wallet_id DESC
    SQL;

    return $this->em->getConnection()
        ->executeQuery($sql, ['mes' => $mes, 'tipo' => $tipoId])
        ->fetchAllAssociative();
}
}



   


