import { Module } from '@nestjs/common';
import { RecursoController } from './recurso.controller';
import { RecursoService } from './recurso.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recurso, RecursoSchema } from './recurso.schema';

@Module({
  controllers: [RecursoController],
  providers: [RecursoService],
  imports: [
    MongooseModule.forFeature([{ name: Recurso.name, schema: RecursoSchema }]),
  ]
})
export class RecursoModule { }
