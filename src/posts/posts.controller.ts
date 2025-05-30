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
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';
import { CommentsService } from 'src/comments/comments.service';
import { CommentEntity } from 'src/comments/entities/comment.entity';
import { TagsOnPostsEntity } from 'src/tags/entities/tags-on-posts.entity';
import { TagsService } from 'src/tags/tags.service';

@Controller('api/v1/posts')
@ApiTags('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly commentsService: CommentsService,
    private readonly tagsService: TagsService,
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
    return new PostEntity(await this.postsService.create(createPostDto));
  }

  @Get()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findAll() {
    const posts = await this.postsService.findAll();
    return posts.map((post) => new PostEntity(post));
  }

  @Get('drafts')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findDrafts() {
    const drafts = await this.postsService.findDrafts();
    return drafts.map((draft) => new PostEntity(draft));
  }

  @Get(':id')
  @ApiOkResponse({ type: PostEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} does not exist.`);
    }
    return new PostEntity(post);
  }

  @Get(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentEntity, isArray: true })
  async findCommentsByPostId(@Param('id', ParseIntPipe) postId: number) {
    const post = await this.postsService.findOne(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} does not exist.`);
    }
    const comments = await this.commentsService.findAllByPostId(postId);
    return comments;
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
    return new PostEntity(await this.postsService.update(id, updatePostDto));
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
    return new PostEntity(await this.postsService.publish(id));
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
    return new PostEntity(await this.postsService.unpublish(id));
  }

  @Post(':id/connect/:tagId')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: TagsOnPostsEntity })
  async connect(
    @Param('id', ParseIntPipe) postId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
  ) {
    const post = await this.postsService.findOne(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} does not exist.`);
    }
    const tag = await this.tagsService.findOne(tagId);
    if (!tag) {
      throw new NotFoundException(`Tag with id ${tagId} does not exist.`);
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

  @Delete(':id/disconnect/:tagId')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TagsOnPostsEntity })
  async disconnect(
    @Param('id', ParseIntPipe) postId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
  ) {
    const post = await this.postsService.findOne(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} does not exist.`);
    }
    const tag = await this.tagsService.findOne(tagId);
    if (!tag) {
      throw new NotFoundException(`Tag with id ${tagId} does not exist.`);
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} does not exist.`);
    }
    if (post.published) {
      throw new BadRequestException(
        `The post with id ${id} is published, cannot delete.`,
      );
    }
    const tagsOnPost = await this.postsService.getTagsOnPost(id);
    for (const tag of tagsOnPost) {
      await this.tagsService.disconnect(tag.tagId, tag.postId);
    }
    const comments = await this.commentsService.findAllByPostId(id);
    for (const comment of comments) {
      await this.commentsService.remove(comment.id);
    }
    return new PostEntity(await this.postsService.remove(id));
  }
}
