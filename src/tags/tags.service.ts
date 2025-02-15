import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: DatabaseService) {}

  create(createTagDto: CreateTagDto) {
    return this.prisma.tag.create({ data: createTagDto });
  }

  findAll() {
    return this.prisma.tag.findMany();
  }

  findOne(id: number) {
    return this.prisma.tag.findUnique({ where: { id } });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
    });
  }

  remove(id: number) {
    return this.prisma.tag.delete({ where: { id } });
  }

  async tagExists(name: string) {
    const tag = await this.prisma.tag.findFirst({ where: { name } });
    if (!tag) {
      return false;
    }
    return true;
  }
}
