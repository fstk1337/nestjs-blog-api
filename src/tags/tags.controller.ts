import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { UpdateTagDto } from './dto/update-tag.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { TagsOnPostsEntity } from './entities/tags-on-posts.entity';
import { PostsService } from 'src/posts/posts.service';

@Controller('api/v1/tags')
@ApiTags('tags')
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: TagEntity })
  async create(@Body() createTagDto: CreateTagDto) {
    const tagExists = await this.tagsService.tagExists(createTagDto.name);
    if (tagExists) {
      throw new BadRequestException(
        `Tag named '${createTagDto.name}' already exists!`,
      );
    }
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @ApiOkResponse({ type: TagEntity, isArray: true })
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: TagEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const tag = await this.tagsService.findOne(id);
    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} does not exist.`);
    }
    return tag;
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TagEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    const tag = await this.tagsService.findOne(id);
    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} does not exist.`);
    }
    const tagExists = await this.tagsService.tagExists(updateTagDto.name);
    if (tagExists) {
      throw new BadRequestException(
        `Tag named '${updateTagDto.name}' already exists!`,
      );
    }
    return this.tagsService.update(id, updateTagDto);
  }

  @Post(':id/connect/:postId')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: TagsOnPostsEntity })
  async connect(
    @Param('id', ParseIntPipe) tagId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const tag = await this.tagsService.findOne(tagId);
    if (!tag) {
      throw new NotFoundException(`Tag with id ${tagId} does not exist.`);
    }
    const post = await this.postsService.findOne(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} does not exist.`);
    }
    const tagsOnPostsExists = await this.tagsService.tagsOnPostsExists(
      tagId,
      postId,
    );
    if (tagsOnPostsExists) {
      throw new BadRequestException(
        `The tag with id ${tagId} already connected to the post with id ${postId}.`,
      );
    }
    const tagsOnPosts = await this.tagsService.connect(tagId, postId);
    return tagsOnPosts;
  }

  @Delete(':id/disconnect/:postId')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TagsOnPostsEntity })
  async disconnect(
    @Param('id', ParseIntPipe) tagId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const tag = await this.tagsService.findOne(tagId);
    if (!tag) {
      throw new NotFoundException(`Tag with id ${tagId} does not exist.`);
    }
    const post = await this.postsService.findOne(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} does not exist.`);
    }
    const tagsOnPostsExists = await this.tagsService.tagsOnPostsExists(
      tagId,
      postId,
    );
    if (!tagsOnPostsExists) {
      throw new BadRequestException(
        `The tag with id ${tagId} is not connected to the post with id ${postId}.`,
      );
    }
    const tagsOnPosts = await this.tagsService.disconnect(tagId, postId);
    return tagsOnPosts;
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TagEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const tag = await this.tagsService.findOne(id);
    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} does not exist.`);
    }
    return this.tagsService.remove(id);
  }
}
