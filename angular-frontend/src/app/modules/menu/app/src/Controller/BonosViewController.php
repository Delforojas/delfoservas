<?php
namespace App\Controller;
// TEST CAMBIO EN LOCAL
use App\Repository\VistasRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;           // 👈 IMPORTANTE


#[Route('/api/vistas')]
class BonosViewController extends AbstractController
{
    // ─────────── VISTA BONOS (GENERAL) ───────────
    #[Route('/vistabonos', name: 'bonos_view', methods: ['GET'])]
public function bonosView(EntityManagerInterface $em): JsonResponse
{
    $sql = <<<'SQL'
        SELECT
          w.usuario_id       AS usuario_id,
          u.nombre           AS cliente,
          tc.nombre          AS tipo_clase,
          b.clases_totales   AS total_clases,
          b.clases_restantes AS clases_restantes,
          b.estado           AS estado,
          to_char(w.fecha, 'YYYY-MM') AS mes
        FROM bonos b
        JOIN wallet w      ON b.wallet_id  = w.id
        JOIN users u       ON w.usuario_id = u.id
        JOIN tipo_clase tc ON b.tipoclase  = tc.id
        ORDER BY b.id
    SQL;

    $rows = $em->getConnection()->executeQuery($sql)->fetchAllAssociative();
    return $this->json($rows);
}


    #[Route('/vistabonos/{usuarioId}', name: 'bonos_view_user', methods: ['GET'], requirements: ['usuarioId' => '\d+'])]
    public function bonosViewPorUsuario(int $usuarioId, EntityManagerInterface $em): JsonResponse
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
            WHERE w.usuario_id = :uid
            ORDER BY b.id
        SQL;

        $rows = $em->getConnection()->executeQuery($sql, ['uid' => $usuarioId])->fetchAllAssociative();
        if (empty($rows)) {
            return $this->json(['message' => 'No se han encontrado bonos para ese usuario'], 404);
        }
        return $this->json($rows);
    }

    // ─────────── CLASES / RESERVAS / WALLET / BONOS POR USUARIO ───────────
    #[Route('/usuarioclases/{id}/clases', name: 'usuario_clases', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getClasesUsuario(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getClasesPorUsuario($id));
    }

    #[Route('/usuarioreservas/{id}/reservas', name: 'usuario_reservas', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getReservasUsuario(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getReservasPorUsuario($id));
    }

    #[Route('/usuariowallet/{id}/wallet', name: 'usuario_wallet', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getWalletUsuario(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getWalletPorUsuario($id));
    }

    #[Route('/usuariobonos/{id}/bonos', name: 'usuario_bonos', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getBonosUsuario(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getBonosPorUsuario($id));
    }

    // ─────────── ALUMNOS POR CLASE ───────────
    #[Route('/claseprofe/{id}/clasealumnos', name: 'clase_alumnos', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getAlumnosPorClase(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getAlumnosPorClase($id));
    }

    #[Route('/claseprofe/{id}/total-alumnos', name: 'clase_total_alumnos', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getTotalAlumnosPorClase(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getTotalAlumnosPorClase($id));
    }

    //VISTAS WALLET

      #[Route('/usuario-wallet', name: 'vista_usuario_wallet_all', methods: ['GET'])]
    public function vistaUsuarioWalletAll(VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getWalletUsuarioAll());
    }

    // Por usuario
    #[Route('/usuario-wallet/{id}', name: 'vista_usuario_wallet_by_user', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function vistaUsuarioWalletPorUsuario(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getWalletUsuario($id));
    }

#[Route('/wallet/mes/{mes}', name: 'vista_wallet_por_mes', methods: ['GET'])]
public function vistaWalletPorMes(string $mes, VistasRepository $repo): JsonResponse
{
    return $this->json($repo->getWalletMes($mes)); // <-- aquí
}

    #[Route('/wallet/meses', name: 'vista_wallet_meses', methods: ['GET'])]
        public function getMesesWallet(EntityManagerInterface $em): JsonResponse
        {
            $sql = "SELECT DISTINCT mes FROM vista_wallet_usuario ORDER BY mes DESC";
            $rows = $em->getConnection()->executeQuery($sql)->fetchAllAssociative();
            return $this->json(array_column($rows, 'mes'));
        }
    #[Route('/wallet/tipoclase/{id}', name: 'vista_wallet_por_tipoclase', methods: ['GET'])]
public function vistaWalletPorTipoClase(int $id, VistasRepository $repo): JsonResponse
{
    return $this->json($repo->getWalletPorTipoClase($id));
}


#[Route('/wallet/filtrar', name: 'wallet_filtrar_mes_tipo', methods: ['GET'])]
public function filtrarPorMesYTipo(Request $req, VistasRepository $repo): JsonResponse
{
    $mes = (string) $req->query->get('mes', '');
    $tipo = (int) $req->query->get('tipoclaseId', 0);

    if (!$mes || !$tipo) {
        return $this->json(['error' => 'Faltan parámetros mes (YYYY-MM) y tipoclaseId'], 400);
    }

    return $this->json($repo->getWalletPorMesYTipo($mes, $tipo));
}
}