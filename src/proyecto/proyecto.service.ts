// proyecto.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Proyecto } from './proyecto.schema';
import { Usuario } from 'src/usuario/usuario.schema';
import { RecursoService } from 'src/recurso/recurso.service';
import { Recurso } from 'src/recurso/recurso.schema';
import { TestingModule } from '@nestjs/testing';

@Injectable()
export class ProyectoService {
  constructor(@InjectModel(Proyecto.name) private proyectoModel: Model<Proyecto>,
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    @InjectModel(Recurso.name) private recursoModel: Model<Recurso>) { }


  //Busca un proyecto en especifico
  async findOne(id: string): Promise<Proyecto | null> {
    return this.proyectoModel.findById(id).exec();
  }

  //Busca un proyecto por su titulo (el titulo no se puede repetir)
  async findOneByTitle(title: string): Promise<Proyecto | null> {
    return this.proyectoModel.findOne({ title }).exec();
  }

  //Actuliza el proyecto especificado
  async update(id: string, data: Partial<{ title: string; description: string; admin_id: string }>): Promise<Proyecto | null> {
    return this.proyectoModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  }

  //Borra el proyecto en especifico
  async remove(id: string): Promise<any> {

    //Borra todos los recursos con ese projectId
    await this.recursoModel.deleteMany({ projectId: id })

    //Quita el string del projectId de la lista de proyectos del usuario, así dejan de esta relacionados
    await this.usuarioModel.updateMany( 
      { proyectos: id },
      { $pull: { proyectos: id } }
    );


    return this.proyectoModel.findByIdAndDelete(id).exec();
  }

  async create(data: { title: string; description: string; admin_id: string }) {
    // Usamos el adminId como string directamente
    
    const proyectoAntiguo = await this.findOneByTitle(data.title)
    
    if(proyectoAntiguo){
      return false
    }

    const adminId = data.admin_id;

    // Crear el proyecto
    const proyecto = new this.proyectoModel({
      title: data.title,
      description: data.description,
      admin_id: adminId,  // Guardar admin_id como string
      usuarios: [adminId],  // Guardar adminId como string en usuarios
    });

    // Guarda el proyecto
    const savedProyecto = await proyecto.save()
    
    //Mete el proyecto a la lista de proyectos del usuario admin, así esta relacionado directamente al ser creado
    const userActualizado = await this.usuarioModel.findByIdAndUpdate(
      adminId,
      { $push: { proyectos: savedProyecto._id?.toString() } },
      { new: true } // Para devolver el usuario actualizado
    );

    // Devolver tanto el proyecto como el usuario actualizado
    return { savedProyecto, userActualizado };
  }

  //Buscar los proyectos de un usuario en concreto
  async findByUserId(userId: string) {

    //Cogemos al usuario en cuestion
    const user = await this.usuarioModel.findById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Usamos Promise.all para esperar a que todas las promesas se resuelvan
    const proyectos = await Promise.all(
      user.proyectos.map(async (proyectoId) => {
        return await this.proyectoModel.findById(proyectoId);
      })
    );

    return proyectos;  // Devuelve la lista de proyectos encontrados
  }

  //Devuelve todos los proyectos
  async findAll() {
    return this.proyectoModel.find().populate('usuarios', 'usename role').exec();
  }

  //Devuelve los usuarios de cierto proyecto
  async findProyectoWithUsuarios(id: string) {
    return this.proyectoModel
      .findById(id)
      .populate('usuarios', 'usename role') // solo los campos que te interesen
      .exec();
  }

  // Agrega el usuario al proyecto
  async addUserToProyecto(proyectoId: string, usuarioId: string) {

    //Mete el usuario a la lista de usuarios del proyecto
    const proyecto = await this.proyectoModel.findByIdAndUpdate(
      proyectoId,
      { $addToSet: { usuarios: usuarioId } }, // Se guarda como string
      { new: true }
    );

    //Mete el proyecto a la lista de proyectos del usuario
    const usuario = await this.usuarioModel.findByIdAndUpdate(
      usuarioId,
      { $addToSet: { proyectos: proyectoId } }, // También como string
      { new: true }
    );

    return { proyecto, usuario };
  }

  //Borra la relacion entre un usuario y un proyecto
  async deleteUserFromProyecto(proyectoId: string, usuarioId: string) {
    // Agregar el usuario al proyecto
    const proyecto = await this.proyectoModel.findByIdAndUpdate(
      proyectoId,

      { $pull: { usuarios: usuarioId } }, // Se guarda como string
      { new: true }
    );

    // Agregar el proyecto al usuario
    const usuario = await this.usuarioModel.findByIdAndUpdate(
      usuarioId,
      { $pull: { proyectos: proyectoId } }, // También como string
      { new: true }
    );

    return { proyecto, usuario };

  }

}
