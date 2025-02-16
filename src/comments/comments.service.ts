import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: DatabaseService) {}

  create(createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({ data: createCommentDto });
  }

  findAll() {
    return this.prisma.comment.findMany();
  }

  findOne(id: number) {
    return this.prisma.comment.findUnique({
      where: { id },
      include: {
        post: true,
        author: true,
      },
    });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  remove(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }

  async commentExists(id: number) {
    const comment = await this.prisma.comment.findFirst({ where: { id } });
    if (!comment) {
      return false;
    }
    return true;
  }
}
