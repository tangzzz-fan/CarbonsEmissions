import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 全局管道
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));

    // API 文档配置
    const config = new DocumentBuilder()
        .setTitle('Carbon Emissions API')
        .setDescription('The Carbon Emissions API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // CORS
    app.enableCors();

    // 全局前缀
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger documentation: http://localhost:${port}/api`);
}

bootstrap(); 