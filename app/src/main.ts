import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const port = process.env.NESTJS_APP_DOCKER_PORT;
    const app = await NestFactory.create(AppModule);

    // Enable CORS so we can access the application from a different origin
    app.enableCors();

    await app.listen(port);
}
bootstrap();
