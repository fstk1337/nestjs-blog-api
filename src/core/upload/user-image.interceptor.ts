import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { fileFilter } from './file-filter';

@Injectable()
export class UserImageInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const userId = parseInt(
      ctx.getRequest<{ params: { id: string } }>().params.id,
    );
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist.`);
    }

    if (
      user.image &&
      fs.existsSync(path.join(__dirname, '../../..', user.image))
    ) {
      fs.unlinkSync(path.join(__dirname, '../../..', user.image));
    }

    const userImgInterceptor = FileInterceptor('file', {
      fileFilter: fileFilter('image'),
      limits: {
        fileSize: parseInt(process.env['IMG_USER_MAX_SIZE'] || '204800'),
      },
      storage: diskStorage({
        destination: function (_, __, cb) {
          const newPath = path.join(
            __dirname,
            '../../..',
            `uploads/users/${user.id}`,
          );
          if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, { recursive: true });
          }
          cb(null, `./uploads/users/${user.id}`);
        },
        filename(_, file, callback) {
          const extension = path.extname(file.originalname);
          const name = path.basename(file.originalname, extension);
          const suffix = v4();
          const uploadedFilename = `${name}-${suffix}${extension}`;
          callback(null, uploadedFilename);
        },
      }),
    });

    return new userImgInterceptor().intercept(context, next);
  }
}
