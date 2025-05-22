import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { MongoConnectionInterceptor } from './mongo-connection.interceptor';
dotenv.config()

async function bootstrap() {
  const cors = require('cors');
  const app = await NestFactory.create(AppModule);

  app.use(cors({
    origin: process.env.CORS!
  }));

  app.useGlobalInterceptors(app.get(MongoConnectionInterceptor));

  const config = new DocumentBuilder()
    .setTitle('Reto Moodle')
    .setDescription('EndPoints de mi moodle')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('documentation', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
