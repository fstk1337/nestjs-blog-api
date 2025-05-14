import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { fileFilter } from './file-filter';

@Injectable()
export class CommonImageInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const commonImgInterceptor = FileInterceptor('file', {
      fileFilter: fileFilter('image'),
      limits: {
        fileSize: parseInt(process.env['IMG_COMMON_MAX_SIZE'] || '204800'),
      },
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
    });

    return new commonImgInterceptor().intercept(context, next);
  }
}
