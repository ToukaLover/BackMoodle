import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {
  const cors = require('cors');
  const app = await NestFactory.create(AppModule);
  app.use(cors({
    origin: 'http://localhost:5173'
  }));
  const config = new DocumentBuilder()
    .setTitle('Reto Moodle')
    .setDescription('EndPoints de mi moodle')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
