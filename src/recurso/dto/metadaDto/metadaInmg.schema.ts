// metadata.schema.ts
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false }) // evita generar _id dentro de metadata
export class MetadataImgDto {
  @Prop()
  objectName:string
}

