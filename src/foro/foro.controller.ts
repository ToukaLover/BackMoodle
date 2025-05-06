import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ForoService } from './foro.service';

@Controller('foro')
export class ForoController {
  constructor(private readonly foroService: ForoService) {}

  @Post()
  create(@Body() createForoDto) {
    return this.foroService.create(createForoDto);
  }

  @Get()
  findAll() {
    return this.foroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foroService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateForoDto) {
    return this.foroService.update(id, updateForoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foroService.remove(id);
  }
}
