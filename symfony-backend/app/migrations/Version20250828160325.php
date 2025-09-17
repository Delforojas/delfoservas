<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250828160325 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE bonos ALTER wallet_id SET NOT NULL');
        $this->addSql('ALTER TABLE clase DROP plazas');
        $this->addSql('ALTER TABLE clase DROP completa');
        $this->addSql('ALTER TABLE clase DROP dia');
        $this->addSql('DROP INDEX uq_reservation_usuario_clase');
        $this->addSql('ALTER TABLE tipo_clase DROP precio');
        $this->addSql('DROP INDEX uniq_users_email');
        $this->addSql('ALTER TABLE users ALTER nombre SET NOT NULL');
        $this->addSql('ALTER TABLE users ALTER email TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE users ALTER roles DROP DEFAULT');
        $this->addSql('ALTER TABLE users ALTER roles TYPE VARCHAR(50)');
        $this->addSql('ALTER TABLE wallet DROP mes');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE wallet ADD mes TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE tipo_clase ADD precio NUMERIC(10, 2) DEFAULT \'0\' NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX uq_reservation_usuario_clase ON reservation (usuario_id, clase_id)');
        $this->addSql('ALTER TABLE bonos ALTER wallet_id DROP NOT NULL');
        $this->addSql('ALTER TABLE clase ADD plazas INT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE clase ADD completa BOOLEAN DEFAULT false NOT NULL');
        $this->addSql('ALTER TABLE clase ADD dia TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE users ALTER nombre DROP NOT NULL');
        $this->addSql('ALTER TABLE users ALTER email TYPE VARCHAR(180)');
        $this->addSql('ALTER TABLE users ALTER roles SET DEFAULT \'alumno\'');
        $this->addSql('ALTER TABLE users ALTER roles TYPE VARCHAR(20)');
        $this->addSql('CREATE UNIQUE INDEX uniq_users_email ON users (email)');
    }
}
