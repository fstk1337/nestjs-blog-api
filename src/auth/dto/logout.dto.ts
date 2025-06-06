import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LogoutDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
