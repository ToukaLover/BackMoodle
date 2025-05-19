import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

@Schema()
export class Proyecto extends Document {

  @ApiProperty()
  @Prop()
  title: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  admin_id:string;

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  usuarios: string[]; // varios usuarios
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);
