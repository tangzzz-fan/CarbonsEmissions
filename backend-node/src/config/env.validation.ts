import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV!: Environment;

    @IsNumber()
    PORT!: number;

    @IsString()
    DB_HOST!: string;

    @IsNumber()
    DB_PORT!: number;

    @IsString()
    DB_USERNAME!: string;

    @IsString()
    DB_PASSWORD!: string;

    @IsString()
    DB_DATABASE!: string;

    @IsString()
    REDIS_URL!: string;

    @IsString()
    JWT_SECRET!: string;

    @IsString()
    PYTHON_API_URL!: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
} 