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

@Controller('api/v1/tags')
@ApiTags('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

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
