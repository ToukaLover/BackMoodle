// file.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Tarea extends Document {
    @ApiProperty()  
    @Prop()
    projectId:string
    @ApiProperty()
    @Prop()
    title: string;
    @ApiProperty()
    @Prop()
    description:string;
    @ApiProperty()
    @Prop()
    visible:boolean;

}

export const TareaSchema = SchemaFactory.createForClass(Tarea);
