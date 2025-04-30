// file.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
export class Recurso extends Document {

    @Prop({required:false})
    projectId: string;

    @Prop({required:false})
    userId: string;
    @Prop({required:false})
    tareaId: string;

    @Prop()
    resourceType: string;

    @Prop({ type: SchemaTypes.Mixed })
    metadata: any;

}

export const RecursoSchema = SchemaFactory.createForClass(Recurso);
