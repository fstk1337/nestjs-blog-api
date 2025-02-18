import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;
}
