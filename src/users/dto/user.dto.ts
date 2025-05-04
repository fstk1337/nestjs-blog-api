import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  age?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsNotEmpty()
  activated: boolean;
}
