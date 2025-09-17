<?php
namespace App\Repository;

use App\Entity\Clase;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\DBAL\Connection;

class ClaseRepository extends ServiceEntityRepository
{
     private Connection $cn;

    public function __construct(ManagerRegistry $registry, Connection $cn)
    {
        parent::__construct($registry, Clase::class);
        $this->cn = $cn; // 👈 inyectamos DBAL para consultar la vista
    }
    public function findAll(): array
{
    return $this->createQueryBuilder('c')
        ->orderBy('c.fecha', 'ASC')
        ->addOrderBy('c.hora', 'ASC')
        ->getQuery()
        ->getResult(); // devuelve Clase[]
}

    public function findAllOrderByFechaHora(): array
    {
        $sql = "SELECT * FROM vista_clases ORDER BY fecha, hora";
        return $this->cn->executeQuery($sql)->fetchAllAssociative();
    }
     public function findByDia(int $dia): array
    {
        $sql = "SELECT * FROM vista_clases WHERE dia = :d ORDER BY fecha, hora";
        return $this->cn->executeQuery($sql, ['d'=>$dia])->fetchAllAssociative();
    }
    public function findByLunes(): array
{
    $sql = "SELECT * FROM vista_clases WHERE dia = 'Lunes' ORDER BY fecha, hora";
    return $this->cn->executeQuery($sql)->fetchAllAssociative();
}

public function findByMartes(): array
{
    $sql = "SELECT * FROM vista_clases WHERE dia = 'Martes' ORDER BY fecha, hora";
    return $this->cn->executeQuery($sql)->fetchAllAssociative();
}

public function findByMiercoles(): array
{
    $sql = "SELECT * FROM vista_clases WHERE dia = 'Miércoles' ORDER BY fecha, hora";
    return $this->cn->executeQuery($sql)->fetchAllAssociative();
}

public function findByJueves(): array
{
    $sql = "SELECT * FROM vista_clases WHERE dia = 'Jueves' ORDER BY fecha, hora";
    return $this->cn->executeQuery($sql)->fetchAllAssociative();
}

public function findByViernes(): array
{
    $sql = "SELECT * FROM vista_clases WHERE dia = 'Viernes' ORDER BY fecha, hora";
    return $this->cn->executeQuery($sql)->fetchAllAssociative();
}

public function findByTeacherFromView(int $teacherId): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = <<<SQL
            SELECT id, nombre, fecha, hora, sala, nombre_tipoclase,
                   aforo_clase, plazas, completa
            FROM vista_clases_por_profesor
            WHERE teacher_id = :tid
            ORDER BY fecha, hora
        SQL;

        return $conn->executeQuery($sql, ['tid' => $teacherId])->fetchAllAssociative();
    }

    public function alumnosDeClase(int $claseId): array
{
    $conn = $this->getEntityManager()->getConnection();
    $sql = <<<SQL
        SELECT alumno_reservation_id, alumno_id, alumno_nombre, alumno_email, total_alumnos
        FROM public.vista_alumnos_por_clase
        WHERE clase_id = :cid
        ORDER BY alumno_nombre
    SQL;

    return $conn->executeQuery($sql, ['cid' => $claseId])->fetchAllAssociative();
}

}
