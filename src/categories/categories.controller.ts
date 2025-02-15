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

@Controller('api/v1/categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CategoryEntity })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const categoryExists = await this.categoriesService.categoryExists(
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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
    const categoryExists = await this.categoriesService.categoryExists(
      updateCategoryDto.name,
    );
    if (categoryExists) {
      throw new BadRequestException(
        `Category named '${updateCategoryDto.name}' already exists!`,
      );
    }
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CategoryEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} does not exist.`);
    }
    return this.categoriesService.remove(id);
  }
}
