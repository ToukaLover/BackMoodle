import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Foro extends Document {

    @Prop({ required: false })
    prevPublId: string;

    @ApiProperty()
    @Prop()
    title: string;

    @ApiProperty()
    @Prop()
    body: string;

    @ApiProperty()
    @Prop()
    date: string

    @ApiProperty()
    @Prop({required:false})
    proyectoId: string

    @ApiProperty()
    @Prop()
    user: string;

}

export const ForoSchema = SchemaFactory.createForClass(Foro);