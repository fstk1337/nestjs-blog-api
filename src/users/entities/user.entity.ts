import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ required: false, nullable: true })
  name: string | null;

  @ApiProperty({ required: false, nullable: true })
  age: number | null;

  @ApiProperty({ default: Role.USER })
  role: Role;

  @ApiProperty({ required: false, nullable: true })
  image: string | null;

  @ApiProperty({ default: true })
  @Exclude()
  activated: boolean;
}
