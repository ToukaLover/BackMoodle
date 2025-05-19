import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

@Schema()
export class Usuario extends Document {

  @ApiProperty()
  @Prop()
  username: string;

  @ApiProperty()
  @Prop()
  password: string;

  @Prop()
  role: string;

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  proyectos: string[];
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
