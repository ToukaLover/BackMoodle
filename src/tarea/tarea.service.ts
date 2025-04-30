import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tarea } from './tarea.schema';
import { Model } from 'mongoose';

@Injectable()
export class TareaService {
  constructor(@InjectModel(Tarea.name) private tareaModel: Model<Tarea>) {}

  async create(data: Partial<Tarea>): Promise<Tarea> {
    const tarea = new this.tareaModel(data);
    return tarea.save();
  }

  async findAll(): Promise<Tarea[]> {
    return this.tareaModel.find().exec();
  }

  async findByProject(projectId: string): Promise<Tarea[]> {
    return this.tareaModel.find({ projectId }).exec();
  }

  async findOne(id: string): Promise<Tarea | null> {
    return this.tareaModel.findById(id).exec();
  }

  async update(id: string, data: Partial<Tarea>): Promise<Tarea | null> {
    return this.tareaModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const res = await this.tareaModel.findByIdAndDelete(id).exec();
    return { deleted: !!res };
  }
}
