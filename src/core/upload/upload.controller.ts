import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import * as path from 'path';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  @Post('common')
  @ApiConsumes('multipart/form-data')
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
}
