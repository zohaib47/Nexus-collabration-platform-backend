import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    rawBody: true, 
  });
  app.setGlobalPrefix('api');
  const logger = new Logger('NexusServer');
  const port = process.env.PORT || 3000;

app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, 
  }));


  const config = new DocumentBuilder()
  .setTitle('Nexus Platform API')
  .setDescription('Investor & Entrepreneur Collaboration Platform')
  .setVersion('1.0')
  .addBearerAuth() 
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);


app.enableCors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(port);
  logger.log(`🚀 Nexus Server is running on: http://localhost:${port}`);
  console.log(`your server is running on port ${port}`)
}
bootstrap();







