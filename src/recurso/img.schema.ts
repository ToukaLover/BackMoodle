// img.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Img extends Document {

    @Prop()
    filename: string;

    @Prop()
    mimetype: string;

    @Prop()
    size: number;

    @Prop({ type: Buffer })
    data: Buffer;

    @Prop()
    projectId: string;

    @Prop()
    resourceType: string;

}

export const ImgSchema = SchemaFactory.createForClass(Img);
