import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Usuario } from './usuario.schema';
import { hash, deHash } from './encrypt/encrypt';
import { Proyecto } from 'src/proyecto/proyecto.schema';

@Injectable()
export class UsuarioService {
    constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
        @InjectModel(Proyecto.name) private proyectoModel: Model<Proyecto>) { }

    async create(data: { username: string; password: string; role: string }): Promise<Usuario> {

        const newPass = await hash(data.password)

        const usuario = new this.usuarioModel({ username: data.username, password: newPass, role: data.role });
        return usuario.save();
    }

    async findAll(): Promise<Usuario[]> {
        return this.usuarioModel.find().exec();
    }

    async findOne(id: string): Promise<Usuario | null> {
        return this.usuarioModel.findById(id).exec();
    }

    async update(id: string, data: Partial<{ username: string; password: string; role: string }>): Promise<Usuario | null> {
        return this.usuarioModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    }

    async remove(id: string): Promise<any> {
        return this.usuarioModel.findByIdAndDelete(id).exec();
    }

    async getAuth(param1: string, param2: string) {

        const bool = await deHash(param1, param2)

        if (bool) {
            return true;
        } else {
            return false;
        }
    }

    async findAdmins(){
        return this.usuarioModel.find({role:'admin'}).exec();
    }

    async findByUsename(username: string): Promise<Usuario | null> {
        return this.usuarioModel.findOne({ username }).exec();
    }

    async getProyectosDeUsuario(usuarioId: string) {
        // Usamos populate para cargar los proyectos relacionados con el usuario
        return await this.usuarioModel
            .findById(usuarioId)
            .populate('proyectos') // Este campo debe ser el que tiene la referencia al Proyecto
            .exec(); // Ejecutamos la consulta
    }

    async findByProjectId(projectId: string) {
        const project = await this.proyectoModel.findById(projectId);
    
        if (!project) {
          throw new Error('Usuario no encontrado');
        }
    
        // Usamos Promise.all para esperar a que todas las promesas se resuelvan
        const users = await Promise.all(
            project.usuarios.map(async (userId) => {
            return await this.usuarioModel.findById(userId).select('id username');
          })
        );
    
        return users;
      }

}
