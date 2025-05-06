import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Foro extends Document {

    @Prop({required:false})
    prevPublId: string;
    
    @Prop()
    title: string;

    @Prop()
    body: string;

    @Prop()
    date:string

    @Prop()
    user:string;

}

export const ForoSchema = SchemaFactory.createForClass(Foro);