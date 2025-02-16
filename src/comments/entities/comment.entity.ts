import { ApiProperty } from '@nestjs/swagger';

export class CommentEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
