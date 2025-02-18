import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { CommentsService } from 'src/comments/comments.service';
import { CommentEntity } from 'src/comments/entities/comment.entity';
import { PostsService } from 'src/posts/posts.service';
import { PostEntity } from 'src/posts/entities/post.entity';

@Controller('api/v1/users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    const emailExists = await this.usersService.emailExists(
      createUserDto.email,
    );
    if (emailExists) {
      throw new BadRequestException(
        `User with email '${createUserDto.email}' already exists!`,
      );
    }
    return new UserEntity(await this.usersService.create(createUserDto));
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
    }
    return new UserEntity(user);
  }

  @Get(':id/posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findPostsByAuthorId(@Param('id', ParseIntPipe) authorId: number) {
    const user = await this.usersService.findOne(authorId);
    if (!user) {
      throw new NotFoundException(`User with id ${authorId} does not exist.`);
    }
    const posts = await this.postsService.findAllByAuthorId(authorId);
    return posts;
  }

  @Get(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentEntity, isArray: true })
  async findCommentsByAuthorId(@Param('id', ParseIntPipe) authorId: number) {
    const user = await this.usersService.findOne(authorId);
    if (!user) {
      throw new NotFoundException(`User with id ${authorId} does not exist.`);
    }
    const comments = await this.commentsService.findAllByAuthorId(authorId);
    return comments;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userExists = await this.usersService.userExists(id);
    if (!userExists) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
    }
    const user = await this.usersService.update(id, updateUserDto);
    return new UserEntity(user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const userExists = await this.usersService.userExists(id);
    if (!userExists) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
    }
    const user = await this.usersService.remove(id);
    return new UserEntity(user);
  }
}
