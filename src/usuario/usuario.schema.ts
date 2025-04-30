import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Usuario extends Document {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  role: string;

  @Prop({ type: [String], default: [] })
  proyectos: string[];
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
