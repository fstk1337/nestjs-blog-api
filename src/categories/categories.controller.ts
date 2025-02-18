import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryEntity } from './entities/category.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { PostsService } from 'src/posts/posts.service';
import { PostEntity } from 'src/posts/entities/post.entity';

@Controller('api/v1/categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CategoryEntity })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const categoryExists = await this.categoriesService.nameExists(
      createCategoryDto.name,
    );
    if (categoryExists) {
      throw new BadRequestException(
        `Category named '${createCategoryDto.name}' already exists!`,
      );
    }
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoryEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} does not exist.`);
    }
    return category;
  }

  @Get(':id/posts')
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findPostsByCategoryId(@Param('id', ParseIntPipe) categoryId: number) {
    const category = await this.categoriesService.findOne(categoryId);
    if (!category) {
      throw new NotFoundException(
        `Category with id ${categoryId} does not exist.`,
      );
    }
    const posts = await this.postsService.findAllByCategoryId(categoryId);
    return posts;
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CategoryEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} does not exist.`);
    }
    const categoryExists = await this.categoriesService.nameExists(
      updateCategoryDto.name,
    );
    if (categoryExists) {
      throw new BadRequestException(
        `Category named '${updateCategoryDto.name}' already exists!`,
      );
    }
    const result = await this.categoriesService.update(id, updateCategoryDto);
    return result;
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CategoryEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} does not exist.`);
    }
    const post = await this.postsService.findOneByCategoryId(id);
    if (post) {
      throw new BadRequestException(
        `There is a post with categoryId ${id}, cannot delete.`,
      );
    }
    const result = await this.categoriesService.remove(id);
    return result;
  }
}
