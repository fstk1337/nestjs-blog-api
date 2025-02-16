import { ApiProperty } from '@nestjs/swagger';

export class PostEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ required: false, default: false })
  published: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
