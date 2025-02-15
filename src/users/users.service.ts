import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { generateHash } from 'src/core/bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: DatabaseService) {}

  create(createUserDto: CreateUserDto) {
    const hash = generateHash(createUserDto.password);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hash,
      },
      omit: { password: true },
    });
  }

  findAll() {
    return this.prisma.user.findMany({ omit: { password: true } });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const newPassword = updateUserDto.password || null;
    if (newPassword) {
      return this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: generateHash(newPassword),
        },
        omit: { password: true },
      });
    }
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      omit: { password: true },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
      omit: { password: true },
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
