import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostsService } from 'src/posts/posts.service';
import { PostImageInterceptor } from './post-image.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserImageInterceptor } from './user-image.interceptor';
import { UsersService } from 'src/users/users.service';
import { ApiFile } from './api-file.decorator';
import { CommonImageInterceptor } from './common-image.interceptor';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('common')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiFile(CommonImageInterceptor)
  uploadCommonImage(@UploadedFile() file: Express.Multer.File) {
    return {
      image: file.path,
      size: file.size,
    };
  }

  @Post('posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiFile(PostImageInterceptor)
  async uploadPostImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.postsService.update(id, {
      image: file.path,
    });

    return {
      image: file.path,
      size: file.size,
    };
  }

  @Post('users/:id')
  @ApiFile(UserImageInterceptor)
  async uploadUserImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.usersService.update(id, {
      image: file.path,
    });

    return {
      image: file.path,
      size: file.size,
    };
  }
}
