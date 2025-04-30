import { IsOptional, IsString } from 'class-validator';
import { MetadataFileDto } from './metadaDto/metadaFile.schema';
// create-file.dto.ts
import { Prop } from '@nestjs/mongoose';

export class CreateTareaFileDto {
  @Prop()
  tareaId: string;

  @Prop()
  userId: string;

  @Prop()
  resourceType: string;

  @Prop({type:MetadataFileDto})
  metadata:MetadataFileDto
  
}
