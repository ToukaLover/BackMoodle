// create-link.dto.ts
import { IsString, IsBoolean, IsOptional, IsDate } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  link: string;

  @IsString()
  projectId: string;

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
