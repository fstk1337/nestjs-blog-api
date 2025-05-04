import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/core/database/database.service';
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
    });
  }

  findAll() {
    return this.prisma.user.findMany({ where: { activated: true } });
  }

  findInactive() {
    return this.prisma.user.findMany({ where: { activated: false } });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
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
      });
    }
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
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
