<?php

// src/Repository/ClaseRepository.php
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
                // Opción A: con entidades + map (sencillo, ya que usas findAll())
                $clases = $this->findAll();

                return array_map(function($c) {
                    return [
                        'id'           => $c->getId(),
                        'nombre'       => $c->getNombre(),
                        'tipoclase'    => $c->getTipoclase()?->getId(),
                        'teacher'      => $c->getTeacher()?->getId(),
                        'fecha'        => $c->getFecha()?->format('Y-m-d'),
                        'hora'         => $c->getHora()?->format('H:i'),
                        'aforo_clase'  => $c->getAforoClase(),
                        'room'         => $c->getRoom()?->getId(),
                    ];
                }, $clases);
            }


            public function crearDesdeArray(array $data): ?Clase
            {
                $em = $this->getEntityManager();

                $tipoClase = $em->getRepository(TipoClase::class)->find($data['tipoclase'] ?? null);
                $teacher   = $em->getRepository(User::class)->find($data['teacher'] ?? null);
                $room      = $em->getRepository(Room::class)->find($data['room'] ?? null);

                if (!$tipoClase || !$teacher || !$room) {
                    return null; 
                }

                $clase = new Clase();
                $clase->setNombre($data['nombre'] ?? '');
                $clase->setTipoclase($tipoClase);
                $clase->setTeacher($teacher);
                $clase->setFecha(new \DateTime($data['fecha'] ?? 'now'));
                $clase->setHora(new \DateTime($data['hora'] ?? '00:00'));
                $clase->setAforoClase((int)($data['aforo_clase'] ?? 0));
                $clase->setRoom($room);

                $em->persist($clase);
                $em->flush();

                return $clase;
            }


            public function actualizarDesdeArray(Clase $clase, array $data): bool
            {
                $em = $this->getEntityManager();

                if (array_key_exists('nombre', $data)) {
                    $clase->setNombre($data['nombre'] ?? '');
                }

                if (array_key_exists('tipoclase', $data)) {
                    $tipo = $data['tipoclase'] ?? null;
                    $tipoClase = $tipo ? $em->getRepository(TipoClase::class)->find($tipo) : null;
                    if ($tipo && !$tipoClase) {
                        return false; // relación inválida
                    }
                    if ($tipoClase) $clase->setTipoclase($tipoClase);
                }

                if (array_key_exists('teacher', $data)) {
                    $teacherId = $data['teacher'] ?? null;
                    $teacher = $teacherId ? $em->getRepository(User::class)->find($teacherId) : null;
                    if ($teacherId && !$teacher) {
                        return false;
                    }
                    if ($teacher) $clase->setTeacher($teacher);
                }

                if (array_key_exists('room', $data)) {
                    $roomId = $data['room'] ?? null;
                    $room = $roomId ? $em->getRepository(Room::class)->find($roomId) : null;
                    if ($roomId && !$room) {
                        return false;
                    }
                    if ($room) $clase->setRoom($room);
                }

                if (array_key_exists('fecha', $data) && $data['fecha']) {
                    try { $clase->setFecha(new \DateTime($data['fecha'])); } catch (\Throwable $e) {}
                }

                if (array_key_exists('hora', $data) && $data['hora']) {
                    try { $clase->setHora(new \DateTime($data['hora'])); } catch (\Throwable $e) {}
                }

                if (array_key_exists('aforo_clase', $data)) {
                    $clase->setAforoClase((int)$data['aforo_clase']);
                }

                $em->flush();
                return true;
            }

            public function listarVista(): array
            {
                $conn = $this->getEntityManager()->getConnection();
                $sql = "SELECT * FROM vista_clases ORDER BY fecha, hora";
                return $conn->fetchAllAssociative($sql);
            }



            public function listarDeProfesor(int $teacherId): array
            {
                $conn = $this->getEntityManager()->getConnection();

                $sql = "
                    SELECT *
                    FROM vista_clases
                    ORDER BY fecha, hora
                ";

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
                u.email        AS alumno_email
                FROM reservation r
                JOIN "user" u ON u.id = r.usuario_id
                WHERE r.clase_id = :claseId ;';

                   return $conn->fetchAllAssociative($sql, ['claseId' => $claseId]);
            }
            
}