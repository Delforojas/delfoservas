<?php
namespace App\Controller;


use Doctrine\DBAL\Connection; 
use App\Repository\VistasRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/vistas')]
class BonosViewController extends AbstractController
{
    // ─────────── VISTA BONOS (GENERAL) ───────────
     
    #[Route('/vistabonos', name: 'bonos_view', methods: ['GET'])]
    public function bonosView(VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->vistaBonos());
    }

     #[Route('/vistabonos/{usuarioId}', name: 'bonos_view_user', methods: ['GET'], requirements: ['usuarioId' => '\d+'])]
    public function bonosViewPorUsuario(int $usuarioId, VistasRepository $repo): JsonResponse
    {
        $rows = $repo->vistaBonosPorUsuario($usuarioId);
        if (!$rows) {
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
     #[Route('/wallet/tipoclase/{id}', name: 'vistas_wallet_tipoclase', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function walletPorTipoClase(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getWalletPorTipoClase($id));
    }

    #[Route('/usuarioreservas/{id}/reservas', name: 'usuario_reservas', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getReservasUsuario(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getReservasPorUsuario($id));
    }

    #[Route('/usuario-wallet/{id}', name: 'vistas_usuario_wallet', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function usuarioWallet(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getWalletPorUsuario($id));
    }

    #[Route('/usuariobonos/{id}/bonos', name: 'usuario_bonos', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getBonosUsuario(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getBonosPorUsuario($id));
    }

    // ─────────── ALUMNOS POR CLASE ───────────
      #[Route('/claseprofe/{id}/clasealumnos', name: 'vistas_clase_alumnos', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getAlumnosPorClase(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getAlumnosPorClase($id));
    }

    #[Route('/claseprofe/{id}/total-alumnos', name: 'clase_total_alumnos', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getTotalAlumnosPorClase(int $id, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->getTotalAlumnosPorClase($id));
    }
   
    #[Route('/wallet/meses', name: 'vistas_wallet_meses', methods: ['GET'])]
    public function getMeses(): JsonResponse
    {
        
        $meses = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        return $this->json($meses);
    }


      #[Route('/wallet/mes/{mes}', name: 'vistas_wallet_mes', methods: ['GET'])]
    public function walletPorMes(string $mes, VistasRepository $repo): JsonResponse
    {
        return $this->json($repo->walletPorMes($mes));
    }
      #[Route('/wallet/filtrar', name: 'vistas_wallet_filtrar', methods: ['GET'])]
    public function walletPorMesYTipo(Request $request, VistasRepository $repo): JsonResponse
    {
        $mes = $request->query->get('mes');                // ej: "August"
        $tipoId = (int) $request->query->get('tipoclaseId'); // ej: 1

        if (!$mes || !$tipoId) {
            return $this->json(['error' => 'Parámetros inválidos'], 400);
        }

        $rows = $repo->getWalletPorMesYTipo($mes, $tipoId);

        if (empty($rows)) {
            return $this->json(['message' => 'No se encontraron resultados'], 404);
        }

        return $this->json($rows);
    }

    
}