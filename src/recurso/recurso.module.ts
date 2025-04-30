import { Module } from '@nestjs/common';
import { RecursoController } from './recurso.controller';
import { RecursoService } from './recurso.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Link, LinkSchema } from './links.schema';
import { Img, ImgSchema } from './img.schema';
import { FileSchema } from './files.schema';
import { Recurso, RecursoSchema } from './recurso.schema';

@Module({
  controllers: [RecursoController],
  providers: [RecursoService],
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
    MongooseModule.forFeature([{ name: Img.name, schema: ImgSchema }]),
    MongooseModule.forFeature([{ name: Recurso.name, schema: RecursoSchema }]),
  ]
})
export class RecursoModule { }
