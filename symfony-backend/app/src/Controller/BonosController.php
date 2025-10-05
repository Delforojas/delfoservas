<?php

namespace App\Controller;

use App\Entity\Bonos;
use App\Entity\TipoClase;
use App\Entity\Wallet;
use App\Repository\BonosRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/bonos')]
class BonosController extends AbstractController
{
   
}