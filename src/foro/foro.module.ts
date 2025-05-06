import { Module } from '@nestjs/common';
import { ForoController } from './foro.controller';
import { ForoService } from './foro.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Foro, ForoSchema } from './foro.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: Foro.name, schema: ForoSchema}])
  ],
  controllers: [ForoController],
  providers: [ForoService]
})
export class ForoModule {}
