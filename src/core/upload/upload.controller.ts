import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import * as path from 'path';
import { PostsService } from 'src/posts/posts.service';
import { PostImageInterceptor } from './post-image.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(private readonly postsService: PostsService) {}

  @Post('common')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/common',
        filename(_, file, callback) {
          const extension = path.extname(file.originalname);
          const name = path.basename(file.originalname, extension);
          const suffix = v4();
          const uploadedFilename = `${name}-${suffix}${extension}`;
          callback(null, uploadedFilename);
        },
      }),
    }),
  )
  uploadCommonImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1048576 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      image: file.path,
      size: file.size,
    };
  }

  @Post('post/:id')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(PostImageInterceptor)
  async uploadPostImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1048576 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.postsService.update(id, {
      image: file.path,
    });

    return {
      image: file.path,
      size: file.size,
    };
  }
}
