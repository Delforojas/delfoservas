<?php

namespace App\Command;

use App\Entity\User;
use App\Entity\Enum\RoleEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Crea un usuario admin si no existe'
)]
class CreateAdminCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // 👉 puedes parametrizar esto luego con argumentos/opciones
        $email    = 'admin@test.com';
        $nombre   = 'Administrador';
        $password = 'Admin123,'; // cámbialo luego

        $repo = $this->em->getRepository(User::class);

        // Evitar duplicados por email (único en tu entidad)
        if ($repo->findOneBy(['email' => $email])) {
            $output->writeln('<comment>Ya existe un usuario con ese email.</comment>');
            return Command::SUCCESS;
        }

        $user = new User();
        $user->setNombre($nombre);
        $user->setEmail($email);
        $user->setRole(RoleEnum::ADMIN);

        $hashed = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashed);

        $this->em->persist($user);
        $this->em->flush();

        $output->writeln('<info>Admin creado correctamente.</info>');

        return Command::SUCCESS;
    }
}