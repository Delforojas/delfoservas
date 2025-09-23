<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250923052238 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE users_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, nombre VARCHAR(255) NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('DROP TABLE users');
        $this->addSql('ALTER TABLE bonos ADD CONSTRAINT FK_2FB585A14E950B90 FOREIGN KEY (tipoclase) REFERENCES tipo_clase (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE bonos ADD CONSTRAINT FK_2FB585A1712520F3 FOREIGN KEY (wallet_id) REFERENCES wallet (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE clase ADD CONSTRAINT FK_199FACCE4E950B90 FOREIGN KEY (tipoclase) REFERENCES tipo_clase (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE clase ADD CONSTRAINT FK_199FACCE41807E1D FOREIGN KEY (teacher_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE clase ADD CONSTRAINT FK_199FACCE54177093 FOREIGN KEY (room_id) REFERENCES room (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955DB38439E FOREIGN KEY (usuario_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C849559F720353 FOREIGN KEY (clase_id) REFERENCES clase (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955A4A00D66 FOREIGN KEY (bono_id) REFERENCES bonos (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE wallet ADD CONSTRAINT FK_7C68921FDB38439E FOREIGN KEY (usuario_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE clase DROP CONSTRAINT FK_199FACCE41807E1D');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C84955DB38439E');
        $this->addSql('ALTER TABLE wallet DROP CONSTRAINT FK_7C68921FDB38439E');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('CREATE SEQUENCE users_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE users (id INT NOT NULL, nombre VARCHAR(255) NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(255) NOT NULL, roles VARCHAR(20) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX uniq_1483a5e9e7927c74 ON users (email)');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('ALTER TABLE bonos DROP CONSTRAINT FK_2FB585A14E950B90');
        $this->addSql('ALTER TABLE bonos DROP CONSTRAINT FK_2FB585A1712520F3');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C849559F720353');
        $this->addSql('ALTER TABLE reservation DROP CONSTRAINT FK_42C84955A4A00D66');
        $this->addSql('ALTER TABLE clase DROP CONSTRAINT FK_199FACCE4E950B90');
        $this->addSql('ALTER TABLE clase DROP CONSTRAINT FK_199FACCE54177093');
    }
}
