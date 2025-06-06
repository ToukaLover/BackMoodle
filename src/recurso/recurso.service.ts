import { Injectable, Body, Delete } from '@nestjs/common';
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
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class RecursoService {

    constructor(@InjectModel(Recurso.name) private recursoModel: Model<Recurso>, private readonly minioService: MinioService) { }
    //Recursos Links
    //Sube un link
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

    //Encuentra los recursos tipo link de cierto proyecto
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

    //Actuliza un Link
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

    //Borra un Link
    async deleteLink(id: string) {
        return this.recursoModel.findByIdAndDelete(id).exec();
    }

    //Recursos Files
    //Sube un recurso tipo "file" que se refiere a cualquier fichero
    async uploadFile(objectName: string, visible: string, projectId: string, title: string) {

        const date = new Date()

        const created = new CreateFileDto()


        created.projectId = projectId
        created.resourceType = "file"

        const metadata = new MetadataFileDto()

        metadata.objectName = objectName
        metadata.date = date
        metadata.title = title
        { visible === "false" ? metadata.visible = false : metadata.visible = true }

        created.metadata = metadata
        const recurso = new this.recursoModel(created)

        return recurso.save();

    }
    //Recoge un fichero por su id
    async getFile(id: string): Promise<Recurso | null> {
        const recurso = await this.recursoModel.findById(id).exec();

        if (recurso?.resourceType === 'file') {
            return recurso;
        }

        return null;
    }

    //Borra un fichero
    async deleteFile(id: string): Promise<DeleteResult | null> {
        const recurso = await this.recursoModel.findById(id).exec();

        await this.minioService.delete(recurso?.metadata.objectName)

        return await this.recursoModel.findByIdAndDelete(id)
    }
    //Actuliza un fichero
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
    //Guarda un ficghero, pero que sea tipo img, ya que no quiero que salgan cuando busco recursos por su projectId
    async uploadImg(projectId: string, objectName: string) {
        const created = new CreateImgDto()

        created.projectId = projectId
        created.resourceType = "img"

        const metadata = new MetadataImgDto()

        metadata.objectName = objectName

        created.metadata = metadata
        const recurso = new this.recursoModel(created)


        return recurso.save();
    }
    //Envia la imagen de cierto proyecto, si existe te manda su binario etc, si no, envia null
    async getImg(id: string) {

        const recurso = await this.recursoModel.findOne({ resourceType: "img", projectId: id });

        if (recurso) {
            return recurso
        } else {
            return null
        }
    }

    //Borra una imagen
    async deleteImg(id: string): Promise<DeleteResult> {
        const recurso = await this.recursoModel.findById(id).exec();

        await this.minioService.delete(recurso?.metadata.objectName)

        return await this.recursoModel.deleteOne(recurso?.id)
    }

    //Recursos (Funciones generales para todos los tipos de recursos)

    async getAllResourcesByProject(projectName: string, titulo: string): Promise<Recurso[]> {
        return this.recursoModel
            .find({
                projectId: projectName,  // Filtra por el nombre del proyecto
                resourceType: { $nin: ['img', 'multimedia'] },  // Excluye los recursos de tipo 'img'
                'metadata.title': { $regex: titulo, $options: 'i' }
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

        const recursos = await this.recursoModel.find({ projectId: id })
        for (let i = 0; i < recursos.length; i++) {
            if (recursos[i].metadata.objectName) {
                await this.minioService.delete(recursos[i].metadata.objectName)
            }
        }
        return await this.recursoModel.deleteMany({ projectId: id })
    }




    //Recursos Tareas


    //Recursos Links

    async uploadTareaLink(body: { link: string; title: string; userId: string, tareaId: string }) {
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

    async uploadTareaFile(body, objectName: string) {

        const date = new Date()

        const created = new CreateTareaFileDto()


        created.tareaId = body.tareaId
        created.userId = body.userId
        created.resourceType = "file"

        const metadata = new MetadataFileDto()

        metadata.date = date
        metadata.objectName = objectName
        metadata.visible = body.visible
        metadata.title = body.title

        created.metadata = metadata
        const recurso = new this.recursoModel(created)

        return recurso.save();

    }

    async findTareaByUserAndTarea(tareaId: string, userId: string) {
        return await this.recursoModel.findOne({ tareaId, userId })

    }

    async findTareaRecursos(tareaId: string) {
        return await this.recursoModel.find({ tareaId }).select('id userId metadata.title metadata.link ')
    }

    async deleteTareaRecursouser(tareaId: string, userId: string): Promise<DeleteResult | null> {
        const recurso = await this.recursoModel.findOne({ tareaId, userId })
        if (recurso?.metadata.objectName) {
            await this.minioService.delete(recurso?.metadata.objectName)
        }
        return await this.recursoModel.deleteOne({ tareaId, userId })
    }
    async remove(id: string) {
        await this.recursoModel.findByIdAndDelete(id)
    }

    //Multimeda
    //Recurso ImgProfile
    //Guarda un ficghero, pero que sea tipo img, ya que no quiero que salgan cuando busco recursos por su projectId
    async uploadMultimedia(projectId: string, objectName: string, title: string) {
        const created = new CreateFileDto()

        created.projectId = projectId
        created.resourceType = "multimedia"

        const metadata = new MetadataFileDto()

        metadata.objectName = objectName
        metadata.title = title

        created.metadata = metadata
        const recurso = new this.recursoModel(created)

        return recurso.save();
    }

    //Recoge un fichero por su id
    async getMulti(id: string): Promise<Recurso | null> {
        const recurso = await this.recursoModel.findById(id).exec();

        if (recurso?.resourceType === 'multimedia') {
            return recurso;
        }

        return null;
    }

    async getMultiByProject(id: string, titulo) {
        return this.recursoModel.find({
            projectId: id,  // Filtra por el nombre del proyecto
            resourceType: 'multimedia',  // Excluye los recursos de tipo 'img'
            'metadata.title': { $regex: titulo, $options: 'i' }
        }
        ).select('id metadata.title')
    }

}