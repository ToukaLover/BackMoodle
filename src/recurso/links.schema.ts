// file.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Link extends Document {

    @Prop()
    link: string;

    @Prop()
    projectId: string;

    @Prop()
    date: Date;

    @Prop()
    visible : boolean;

    @Prop()
    title : string;

    @Prop()
    resourceType: string;

}

export const LinkSchema = SchemaFactory.createForClass(Link);
