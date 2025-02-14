import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: DatabaseService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      omit: { passwordHash: true },
    });
  }

  findAll() {
    return this.prisma.user.findMany({ omit: { passwordHash: true } });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      omit: { passwordHash: true },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      omit: { passwordHash: true },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
      omit: { passwordHash: true },
    });
  }

  async userExists(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      return false;
    }
    return true;
  }

  async emailExists(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      return false;
    }
    return true;
  }
}
