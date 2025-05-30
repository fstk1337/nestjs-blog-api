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

  findAllByAuthorId(authorId: number) {
    return this.prisma.post.findMany({ where: { authorId } });
  }

  findAllByCategoryId(categoryId: number) {
    return this.prisma.post.findMany({ where: { categoryId } });
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
        tags: true,
        comments: true,
      },
    });
  }

  findOneByCategoryId(categoryId: number) {
    return this.prisma.post.findFirst({
      where: { categoryId },
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

  async postExists(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      return false;
    }
    return true;
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

  async getTagsOnPost(postId: number) {
    const tags = await this.prisma.tagsOnPosts.findMany({ where: { postId } });
    return tags;
  }
}
