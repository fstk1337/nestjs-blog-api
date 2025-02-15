import { ApiProperty } from '@nestjs/swagger';

enum Role {
  USER,
  ADMIN,
}

export class UserEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;

  @ApiProperty({ required: false, nullable: true })
  age: number | null;

  @ApiProperty({ default: Role.USER })
  role: Role;
}
