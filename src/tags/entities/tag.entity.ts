import { ApiProperty } from '@nestjs/swagger';

export class TagEntity {
  @ApiProperty()
  name: string;
}
