import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: DatabaseService) {}

  create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({ data: createPostDto });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  findDrafts() {
    return this.prisma.post.findMany({ where: { published: false } });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        comments: true,
      },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({ where: { id }, data: updatePostDto });
  }

  publish(id: number) {
    return this.prisma.post.update({
      where: { id },
      data: { published: true },
    });
  }

  unpublish(id: number) {
    return this.prisma.post.update({
      where: { id },
      data: { published: false },
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }

  async postUnique(authorId: number, categoryId: number, title: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        authorId,
        categoryId,
        title,
      },
    });
    if (!post) {
      return false;
    }
    return true;
  }
}
