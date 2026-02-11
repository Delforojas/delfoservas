<?php


namespace App\Repository;
use App\Entity\Clase;
use App\Entity\TipoClase;
use App\Entity\User;
use App\Entity\Room;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ClaseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Clase::class);
    }


    public function listarIndex(): array
    {
       
        $clases = $this->findAll();

        return array_map(function ($c) {
            return [
                'id' => $c->getId(),
                'nombre' => $c->getNombre(),
                'tipoclase' => $c->getTipoclase()?->getId(),
                'teacher' => $c->getTeacher()?->getId(),
                'fecha' => $c->getFecha()?->format('Y-m-d'),
                'hora' => $c->getHora()?->format('H:i'),
                'aforo_clase' => $c->getAforoClase(),
                'room' => $c->getRoom()?->getId(),
            ];
        }, $clases);
    }


    public function crearDesdeArray(array $data): ?Clase
    {
        $em = $this->getEntityManager();

        $tipoClase = $em->getRepository(TipoClase::class)->find($data['tipoclase'] ?? null);
        $teacher = $em->getRepository(User::class)->find($data['teacher'] ?? null);
        $room = $em->getRepository(Room::class)->find($data['room'] ?? null);

        if (!$tipoClase || !$teacher || !$room) {
            return null;
        }

        $clase = new Clase();
        $clase->setNombre($data['nombre'] ?? '');
        $clase->setTipoclase($tipoClase);
        $clase->setTeacher($teacher);
        $clase->setFecha(new \DateTime($data['fecha'] ?? 'now'));
        $clase->setHora(new \DateTime($data['hora'] ?? '00:00'));
        $clase->setAforoClase((int) ($data['aforo_clase'] ?? 0));
        $clase->setRoom($room);

        $em->persist($clase);
        $em->flush();

        return $clase;
    }



    public function listarVista(): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = <<<'SQL'
SELECT
  c.id,
  c.nombre,
  c.aforo_clase,
  c.fecha,
  TO_CHAR(c.hora, 'HH24:MI') AS hora,
  u.nombre       AS profesor,
  rm.descripcion AS sala,
  tc.id          AS tipoclase_id,
  tc.nombre      AS tipoclase_nombre,
  COALESCE(COUNT(r.id), 0)                 AS reservas,
  c.aforo_clase - COALESCE(COUNT(r.id), 0) AS plazas,
  (c.aforo_clase - COALESCE(COUNT(r.id), 0)) <= 0 AS completa
FROM clase c
LEFT JOIN "user"      u  ON u.id  = c.teacher_id
LEFT JOIN room        rm ON rm.id = c.room_id
LEFT JOIN tipo_clase  tc ON tc.id = c.tipoclase
LEFT JOIN reservation r  ON r.clase_id = c.id
GROUP BY
  c.id, c.nombre, c.aforo_clase, c.fecha, c.hora,
  u.nombre, rm.descripcion, tc.id, tc.nombre
ORDER BY c.fecha, c.hora
SQL;

        return $conn->fetchAllAssociative($sql);
    }



    public function listarDeProfesor(int $teacherId): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
        SELECT
            c.id,
            c.nombre,
            c.aforo_clase,
            c.fecha,
            TO_CHAR(c.hora, \'HH24:MI\') AS hora,
            u.nombre       AS profesor,
            rm.descripcion AS sala,
            tc.id          AS tipoclase_id,
            tc.nombre      AS tipoclase_nombre,
            COALESCE(COUNT(r.id), 0)                 AS reservas,
            c.aforo_clase - COALESCE(COUNT(r.id), 0) AS plazas,
            (c.aforo_clase - COALESCE(COUNT(r.id), 0)) <= 0 AS completa
        FROM clase c
        LEFT JOIN "user"      u  ON u.id  = c.teacher_id
        LEFT JOIN room        rm ON rm.id = c.room_id
        LEFT JOIN tipo_clase  tc ON tc.id = c.tipoclase
        LEFT JOIN reservation r  ON r.clase_id = c.id
        WHERE c.teacher_id = :uid
        GROUP BY
          c.id, c.nombre, c.aforo_clase, c.fecha, c.hora,
          u.nombre, rm.descripcion, tc.id, tc.nombre
        ORDER BY c.fecha, c.hora;
    ';

        return $conn->fetchAllAssociative($sql, ['uid' => $teacherId]);
    }


    public function porClase(int $claseId): array
    {
        $conn = $this->getEntityManager()->getConnection();

        
    $sql = '
        SELECT
            r.clase_id,
            u.id           AS alumno_id,
            u.nombre       AS alumno_nombre,
            u.email        AS alumno_email,
            CASE
                WHEN u.profile_image IS NOT NULL
                    THEN CONCAT(\'/uploads/\', u.profile_image)
                ELSE NULL
            END AS avatar
        FROM reservation r
        JOIN "user" u ON u.id = r.usuario_id
        WHERE r.clase_id = :claseId;
    ';

        return $conn->fetchAllAssociative($sql, ['claseId' => $claseId]);
    }

}