import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Foro } from './foro.schema';

@Injectable()
export class ForoService {
  constructor(@InjectModel(Foro.name) private foroModel: Model<Foro>) {}

  async create(createForoDto): Promise<Foro> {
    const foro = new this.foroModel(createForoDto);
    return foro.save();
  }

  async findAll(): Promise<Foro[]> {
    return this.foroModel.find().exec();
  }

  async findOne(id: string): Promise<Foro> {
    const foro = await this.foroModel.findById(id).exec();
    if (!foro) throw new NotFoundException(`Foro with ID ${id} not found`);
    return foro;
  }

  async update(id: string, updateForoDto): Promise<Foro> {
    const foro = await this.foroModel.findByIdAndUpdate(id, updateForoDto, { new: true }).exec();
    if (!foro) throw new NotFoundException(`Foro with ID ${id} not found`);
    return foro;
  }

  async remove(id: string): Promise<void> {
    const result = await this.foroModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Foro with ID ${id} not found`);
  }
}
