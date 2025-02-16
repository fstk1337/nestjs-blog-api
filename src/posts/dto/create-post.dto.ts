import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
