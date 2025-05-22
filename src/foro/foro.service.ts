import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Foro } from './foro.schema';

@Injectable()
export class ForoService {
  constructor(@InjectModel(Foro.name) private foroModel: Model<Foro>) { }

  async create(createForoDto: Foro): Promise<Foro> {
    const foro = new this.foroModel(createForoDto);
    return foro.save();
  }

  //Busca cierto numero de publicaciones del foro 
  async findAll(page = 1, limit = 10): Promise<{ data: Foro[]; total: number }> {
    const skip = (page - 1) * limit;

    const filter = {
      prevPublId: { $in: [null, ""] },
      $or: [
        { proyectoId: { $exists: false } },
        { proyectoId: null },
        { proyectoId: "" }
      ]
    };

    const [data, total] = await Promise.all([
      this.foroModel.find(filter).skip(skip).limit(limit).exec(),
      this.foroModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findByProyectoId(
    proyectoId: string,
    page = 1,
    limit = 10
  ): Promise<{ data: Foro[]; total: number }> {
    const skip = (page - 1) * limit;

    // Filtro para proyectoId, también puedes añadir más condiciones si quieres
    const filter = { proyectoId };

    const [data, total] = await Promise.all([
      this.foroModel.find(filter).skip(skip).limit(limit).exec(),
      this.foroModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  //Busca una publicacion del foro en concreto (no se usa)
  async findOne(id: string): Promise<Foro> {
    const foro = await this.foroModel.findById(id).exec();
    if (!foro) throw new NotFoundException(`Foro with ID ${id} not found`);
    return foro;
  }

  //Actuliza una publicacion (no se usa)
  async update(id: string, updateForoDto: Foro): Promise<Foro> {
    const foro = await this.foroModel.findByIdAndUpdate(id, updateForoDto, { new: true }).exec();
    if (!foro) throw new NotFoundException(`Foro with ID ${id} not found`);
    return foro;
  }

  //Elimina la publicacion especificada
  async remove(id: string): Promise<void> {

    const hijos = await this.foroModel.find({ prevPublId: id })

    for (let i = 0; i < hijos.length; i++) {
      await this.remove(hijos[i].id)
    }

    const result = await this.foroModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Foro with ID ${id} not found`);
  }

  //Busca las publicaciones que tenga el prevPublId mandado
  async findByParentId(parentId: string): Promise<Foro[]> {
    return this.foroModel.find({ prevPublId: parentId }).exec();
  }

}
