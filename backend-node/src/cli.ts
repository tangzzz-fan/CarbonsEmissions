import { NestFactory } from '@nestjs/core';
import { CommandFactory } from 'nest-commander';
import { SeedModule } from './database/seeds/seed.module';

async function bootstrap() {
    try {
        await CommandFactory.run(SeedModule, {
            logger: ['error', 'warn', 'log'],
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

bootstrap(); 