// create-file.dto.ts
import { Prop } from '@nestjs/mongoose';
import { MetadataImgDto } from './metadaDto/metadaInmg.schema';

export class CreateImgDto {
  @Prop()
  projectId: string;

  @Prop()
  resourceType: string;

  @Prop({type:MetadataImgDto})
  metadata:MetadataImgDto
  
}
