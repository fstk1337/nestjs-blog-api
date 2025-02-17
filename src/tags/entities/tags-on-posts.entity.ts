import { ApiProperty } from '@nestjs/swagger';

export class TagsOnPostsEntity {
  @ApiProperty()
  postId: number;

  @ApiProperty()
  tagId: number;

  @ApiProperty()
  assignedAt: Date;

  @ApiProperty()
  assigneeId: number;
}
