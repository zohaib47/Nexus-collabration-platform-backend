import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    rawBody: true, 
  });
  app.setGlobalPrefix('api');
  const logger = new Logger('NexusServer');
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Nexus Server is running on: http://localhost:${port}`);
  console.log(`your server is running on port ${port}`)
}
bootstrap();







