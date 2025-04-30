// metadata.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) // evita generar _id dentro de metadata
export class MetadataFileDto {
  @Prop()
  mimetype: string;

  @Prop()
  size: number;

  @Prop()
  data: Buffer;
  @Prop()
  visible: Boolean;
  @Prop()
  date: Date;
  @Prop()
  title: string;
}

