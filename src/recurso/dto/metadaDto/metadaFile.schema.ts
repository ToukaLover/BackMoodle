// metadata.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) // evita generar _id dentro de metadata
export class MetadataFileDto {
  @Prop()
  objectName: string;
  @Prop()
  title: string;
  @Prop()
  visible: Boolean;
  @Prop()
  date: Date;
  
}

