// file.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';

@Schema()
export class Recurso extends Document {

    @ApiProperty()
    @Prop({required:false})
    projectId: string;

    @ApiProperty()
    @Prop({required:false})
    userId: string;

    @ApiProperty()
    @Prop({required:false})
    tareaId: string;

    @ApiProperty()
    @Prop()
    resourceType: string;

    @ApiProperty()
    @Prop({ type: SchemaTypes.Mixed })
    metadata: any;

}

export const RecursoSchema = SchemaFactory.createForClass(Recurso);
