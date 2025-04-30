// file.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class File extends Document {

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

    @Prop()
    date: Date;

    @Prop()
    visible : boolean;
    
    @Prop()
    title : string;

}

export const FileSchema = SchemaFactory.createForClass(File);
