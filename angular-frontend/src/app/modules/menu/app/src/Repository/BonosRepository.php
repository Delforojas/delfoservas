<?php
namespace App\Repository;

use App\Entity\Bonos;
use Doctrine\DBAL\Connection;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

class BonosRepository extends ServiceEntityRepository
{
    private Connection $cn;

    public function __construct(ManagerRegistry $registry, Connection $cn)
    {
        parent::__construct($registry, Bonos::class);
        $this->cn = $cn; // 👈 guardamos la conexión
    }

    public function findBonoActivoByUsuario(int $usuarioId): ?array
    {
        $sql = <<<SQL
        SELECT *
        FROM vista_usuarios_bonos_activos
        WHERE usuario_id = :uid
          AND estado = 'activo'
        ORDER BY fecha_wallet DESC
    SQL;

    return $this->cn
        ->executeQuery($sql, ['uid' => $usuarioId])
        ->fetchAllAssociative(); // 👈 todas las filas
}
}