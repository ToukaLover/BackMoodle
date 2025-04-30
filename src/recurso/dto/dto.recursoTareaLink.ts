// create-link.dto.ts
import { IsString, IsBoolean, IsOptional, IsDate } from 'class-validator';

export class CreateTareaLinkDto {
  @IsString()
  link: string;

  @IsString()
  userId: string;

  @IsString()
  tareaId: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  resourceType: string;
}
