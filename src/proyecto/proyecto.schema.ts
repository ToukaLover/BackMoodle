import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Proyecto extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  admin_id:string;

  @Prop({ type: [String], default: [] })
  usuarios: string[]; // varios usuarios
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);
