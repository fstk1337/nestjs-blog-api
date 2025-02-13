import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  passwordHash: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  age?: number;
}
