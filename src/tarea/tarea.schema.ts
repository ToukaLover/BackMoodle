// file.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tarea extends Document {

    @Prop()
    projectId:string

    @Prop()
    title: string;

    @Prop()
    description:string;

    @Prop()
    visible:boolean;

}

export const TareaSchema = SchemaFactory.createForClass(Tarea);
