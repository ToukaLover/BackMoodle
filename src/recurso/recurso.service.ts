import { Injectable, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recurso } from './recurso.schema';
import { CreateLinkDto } from './dto/dto-recursoLink';
import { CreateFileDto } from './dto/dto-recursoFile';
import { MetadataFileDto } from './dto/metadaDto/metadaFile.schema';
import { Binary } from 'bson';
import { MetadataImgDto } from './dto/metadaDto/metadaInmg.schema';
import { CreateImgDto } from './dto/dto-recursoImg';
import { DeleteResult } from 'mongodb';
import { CreateTareaFileDto } from './dto/dto.recursoTareaFile';

@Injectable()
export class RecursoService {

    constructor(@InjectModel(Recurso.name) private recursoModel: Model<Recurso>) { }
    //Recursos Links

    async uploadLink(body: { link: string; title: string; visible: boolean; projectId: string }) {
        const date = new Date();

        const created = new this.recursoModel({
            projectId: body.projectId,
            resourceType: "link",
            metadata: {
                link: body.link,
                title: body.title,
                visible: body.visible,
                date: date,
            },
        });

        return created.save();
    }


    async findByProjectId(projectId: string): Promise<CreateLinkDto[]> {
        const recursos = await this.recursoModel.find({
            projectId,
            resourceType: 'link',
        }).exec();

        return recursos.map((r) => ({
            resourceType: 'link',
            link: r.metadata?.link,
            title: r.metadata?.title,
            visible: r.metadata?.visible,
            date: r.metadata?.date,
            projectId: r.projectId,
        }));
    }


    async updateLink(id: string, body: Partial<CreateLinkDto>) {
        const updateFields = {};

        if (body.visible !== undefined) {
            updateFields['metadata.visible'] = body.visible;
        }
        if (body.title !== undefined) {
            updateFields['metadata.title'] = body.title;
        }

        return this.recursoModel.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true },
        ).exec();
    }

    async deleteLink(id: string) {
        return this.recursoModel.findByIdAndDelete(id).exec();
    }

    //Recursos Files

    async uploadFile(body, file: Express.Multer.File) {

        const date = new Date()

        const created = new CreateFileDto()


        created.projectId = body.projectId
        created.resourceType = "file"

        const metadata = new MetadataFileDto()

        metadata.date = date
        metadata.data = file.buffer
        metadata.mimetype = file.mimetype
        metadata.size = file.size
        metadata.title = body.title
        metadata.visible = body.visible

        created.metadata = metadata
        const recurso = new this.recursoModel(created)

        return recurso.save();

    }

    async getFile(id: string) {
        const recurso = await this.recursoModel.findById(id).exec();

        const binary = recurso?.metadata.data

        const buffer = (binary instanceof Binary)
            ? binary.buffer
            : Buffer.from(binary.buffer);

        const recursoEnviado = {

            projectId: recurso?.projectId,

            resourceType: recurso?.resourceType,

            metadata: {

                mimetype: recurso?.metadata.mimetype,

                size: recurso?.metadata.size,

                data: buffer,
                visible: recurso?.metadata.visible,
                date: recurso?.metadata.date,
                title: recurso?.metadata.title

            }

        }

        if (recurso?.resourceType === 'file') {
            return recursoEnviado;
        }

        return null;
    }


    async deleteFile(id: string) {
        return this.recursoModel.findByIdAndDelete(id).exec();
    }

    async updateFile(id: string, body: Partial<CreateLinkDto>) {
        const updateFields = {};

        if (body.visible !== undefined) {
            updateFields['metadata.visible'] = body.visible;
        }
        if (body.title !== undefined) {
            updateFields['metadata.title'] = body.title;
        }

        return this.recursoModel.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        ).exec();
    }

    //Recurso ImgProfile

    async uploadImg(file: Express.Multer.File, projectId: string) {
        const created = new CreateImgDto()

        created.projectId = projectId
        created.resourceType = "img"

        const metadata = new MetadataImgDto()

        metadata.data = file.buffer
        metadata.mimetype = file.mimetype
        metadata.size = file.size

        created.metadata = metadata
        const recurso = new this.recursoModel(created)


        return recurso.save();
    }
    async getImg(id: string) {

        const recurso = await this.recursoModel.findOne({ resourceType: "img", projectId: id });

        if (recurso) {

            const binary = recurso?.metadata.data

            const buffer = (binary instanceof Binary)
                ? binary.buffer
                : Buffer.from(binary.buffer);

            const recursoEnviado = {
                projectId: recurso?.projectId,
                resourceType: recurso?.resourceType,
                metadata: {
                    mimetype: recurso?.metadata.mimetype,
                    size: recurso?.metadata.size,
                    data: buffer,
                    visible: recurso?.metadata.visible,
                    date: recurso?.metadata.date,
                    title: recurso?.metadata.title

                }
            }

            return (recursoEnviado)
        }else{
            return null
        }
    }

    async getDefaultImg(id:string) {

        const recurso = await this.recursoModel.findById(id);


        if (recurso) {

            const binary = recurso?.metadata.data

            const buffer = (binary instanceof Binary)
                ? binary.buffer
                : Buffer.from(binary.buffer);

            const recursoEnviado = {
                projectId: recurso?.projectId,
                resourceType: recurso?.resourceType,
                metadata: {
                    mimetype: recurso?.metadata.mimetype,
                    size: recurso?.metadata.size,
                    data: buffer,
                    visible: recurso?.metadata.visible,
                    date: recurso?.metadata.date,
                    title: recurso?.metadata.title

                }
            }
            return (recursoEnviado)
        }else{
            return null
        }
    }

    async deleteImg(id: string) {
        return this.recursoModel.findByIdAndDelete(id).exec();
    }

    //Recursos

    async getAllResourcesByProject(projectName: string): Promise<Recurso[]> {
        return this.recursoModel
            .find({
                projectId: projectName,  // Filtra por el nombre del proyecto
                resourceType: { $ne: 'img' }  // Excluye los recursos de tipo 'img'
            })
            .select('id metadata.title metadata.link metadata.visible')
            .sort({ date: 1 })  // Ordena por fecha en orden ascendente (más antiguo primero)
            .exec();
    }

    // Actualizar recurso tipo Link o File (usamos Partial)
    async updateRecurso(id: string, body: { visible?: boolean; title?: string }) {
        const updateFields: any = {};

        if (body.visible !== undefined) {
            updateFields['metadata.visible'] = body.visible;
        }
        if (body.title !== undefined) {
            updateFields['metadata.title'] = body.title;
        }

        return this.recursoModel.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        ).exec();
    }

    // Eliminar recurso por projectId (Link, File o Img)
    async deleteRecursosByProject(id: string): Promise<DeleteResult> {
        return await this.recursoModel.deleteMany({ projectId: id })
    }




    //Recursos Tareas
    
    
    //Recursos Links

    async uploadTareaLink(body: { link: string; title: string; userId: string,tareaId:string }) {
        const date = new Date();

        const created = new this.recursoModel({
            tareaId: body.tareaId,
            userId: body.userId,
            resourceType: "link",
            metadata: {
                link: body.link,
                title: body.title,
                date: date,
            },
        });

        return created.save();
    }
    //Recursos Files

    async uploadTareaFile(body, file: Express.Multer.File) {

        const date = new Date()

        const created = new CreateTareaFileDto()


        created.tareaId = body.tareaId
        created.userId = body.userId
        created.resourceType = "file"

        const metadata = new MetadataFileDto()

        metadata.date = date
        metadata.data = file.buffer
        metadata.mimetype = file.mimetype
        metadata.size = file.size
        metadata.title = body.title

        created.metadata = metadata
        const recurso = new this.recursoModel(created)

        return recurso.save();

    }

    async findTareaByUserAndTarea(tareaId:string,userId:string){

        return await this.recursoModel.findOne({tareaId,userId})

    }

}