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
    return this.prisma.tag.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
    });
  }

  connect(tagId: number, postId: number) {
    return this.prisma.tagsOnPosts.create({
      data: {
        postId,
        tagId,
        assigneeId: 1,
      },
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

  async tagsOnPostsExists(tagId: number, postId: number) {
    const tagsOnPosts = await this.prisma.tagsOnPosts.findUnique({
      where: {
        postId_tagId: {
          postId,
          tagId,
        },
      },
    });
    if (!tagsOnPosts) {
      return false;
    }
    return true;
  }
}
