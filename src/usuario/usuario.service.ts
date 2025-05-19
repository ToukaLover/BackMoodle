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

    //Crea usuario
    async create(data: { username: string; password: string; role: string }): Promise<Usuario> {

        const newPass = await hash(data.password)

        const usuario = new this.usuarioModel({ username: data.username, password: newPass, role: data.role });
        return usuario.save();
    }
    //Devuelve todos los usuarios
    async findAll(): Promise<Usuario[]> {
        return this.usuarioModel.find().exec();
    }
    //Devuelve un usuario en especifico
    async findOne(id: string): Promise<Usuario | null> {
        return this.usuarioModel.findById(id).exec();
    }
    //Actualiza la contraseña del usuario
    async update(id: string, data: { password: string }): Promise<Usuario | null> {
        const hashedPass = await hash(data.password)
        return this.usuarioModel.findByIdAndUpdate(id, { $set: { password: hashedPass } }, { new: true }).exec();
    }
    //Elimina un usuario
    async remove(id: string): Promise<any> {

        //tambien quita el usuario de los proyectos relacionados
        await this.proyectoModel.updateMany(
            { usuarios: id },
            { $pull: { usuarios: id } }
        );

        return this.usuarioModel.findByIdAndDelete(id).exec();
    }

    //Compara si la contraseña es correcta (comparandola con el hash)
    async getAuth(param1: string, param2: string) {

        const bool = await deHash(param1, param2)

        if (bool) {
            return true;
        } else {
            return false;
        }
    }

    //Devuelve un array con los usuarios con role admin
    async findAdmins() {
        return this.usuarioModel.find({ role: 'admin' }).exec();
    }
    //Encuentra un usuario por su username
    async findByUsename(username: string): Promise<Usuario | null> {
        return this.usuarioModel.findOne({ username }).exec();
    }
    //Busca un usuarios y devuelve sus proyectos
    async getProyectosDeUsuario(usuarioId: string) {
        // Usamos populate para cargar los proyectos relacionados con el usuario
        return await this.usuarioModel
            .findById(usuarioId)
            .populate('proyectos') // Este campo debe ser el que tiene la referencia al Proyecto
            .exec(); // Ejecutamos la consulta
    }
    //Encontramos todos los usuarios que pertenezcan a un proyecto en concreto
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
