import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1703123456789 implements MigrationInterface {
    name = 'CreateInitialTables1703123456789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR UNIQUE NOT NULL,
                "email" VARCHAR UNIQUE NOT NULL,
                "password" VARCHAR NOT NULL,
                "isActive" BOOLEAN DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "emissions" (
                "id" SERIAL PRIMARY KEY,
                "value" FLOAT NOT NULL,
                "unit" VARCHAR NOT NULL,
                "source" VARCHAR NOT NULL,
                "measurementTime" TIMESTAMP NOT NULL,
                "userId" INTEGER REFERENCES "users"("id"),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "emissions"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
} 