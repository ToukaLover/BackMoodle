import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const cors = require('cors');
  const app = await NestFactory.create(AppModule);
  app.use(cors({
    origin: 'http://localhost:5173'
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
