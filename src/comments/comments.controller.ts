import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentEntity } from './entities/comment.entity';
import { UsersService } from 'src/users/users.service';
import { PostsService } from 'src/posts/posts.service';

@Controller('api/v1/comments')
@ApiTags('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CommentEntity })
  async create(@Body() createCommentDto: CreateCommentDto) {
    const post = await this.postsService.findOne(createCommentDto.postId);
    if (!post) {
      throw new BadRequestException(
        `Post with id ${createCommentDto.postId} does not exist.`,
      );
    }
    const userExists = await this.usersService.userExists(
      createCommentDto.authorId,
    );
    if (!userExists) {
      throw new BadRequestException(
        `User with id ${createCommentDto.authorId} does not exist.`,
      );
    }
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @ApiOkResponse({ type: CommentEntity, isArray: true })
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: CommentEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const comment = await this.commentsService.findOne(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} does not exist.`);
    }
    return comment;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentsService.findOne(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} does not exist.`);
    }
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const comment = await this.commentsService.findOne(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} does not exist.`);
    }
    return this.commentsService.remove(id);
  }
}
