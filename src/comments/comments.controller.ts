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

@Controller('api/v1/comments')
@ApiTags('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CommentEntity })
  create(@Body() createCommentDto: CreateCommentDto) {
    // TODO: add check if 1) post exists and 2) author exists
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
