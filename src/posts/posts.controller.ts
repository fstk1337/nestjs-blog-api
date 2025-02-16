import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostEntity } from './entities/post.entity';

@Controller('api/v1/posts')
@ApiTags('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PostEntity })
  async create(@Body() createPostDto: CreatePostDto) {
    const authorExists = await this.usersService.userExists(
      createPostDto.authorId,
    );
    if (!authorExists) {
      throw new BadRequestException(
        `User with id ${createPostDto.authorId} does not exist.`,
      );
    }
    const categoryExists = await this.categoriesService.categoryExists(
      createPostDto.categoryId,
    );
    if (!categoryExists) {
      throw new BadRequestException(
        `Category with id ${createPostDto.categoryId} does not exist.`,
      );
    }
    const postUnique = await this.postsService.postUnique(
      createPostDto.authorId,
      createPostDto.categoryId,
      createPostDto.title,
    );
    if (postUnique) {
      throw new BadRequestException(
        `Post with authorId '${createPostDto.authorId}', categoryId '${createPostDto.categoryId}' and title '${createPostDto.title}' already exists!`,
      );
    }
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: PostEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} does not exist.`);
    }
    return post;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} does not exist.`);
    }
    return this.postsService.update(id, updatePostDto);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async publish(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} does not exist.`);
    }
    return this.postsService.publish(id);
  }

  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async unpublish(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} does not exist.`);
    }
    return this.postsService.unpublish(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} does not exist.`);
    }
    return this.postsService.remove(id);
  }
}
