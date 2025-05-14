import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { PostsService } from 'src/posts/posts.service';
import { Observable } from 'rxjs';
import { fileFilter } from './file-filter';

const rootPath = path.resolve('./');

@Injectable()
export class PostImageInterceptor implements NestInterceptor {
  constructor(private readonly postsService: PostsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const postId = parseInt(
      ctx.getRequest<{ params: { id: string } }>().params.id,
    );
    const post = await this.postsService.findOne(postId);

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} does not exist.`);
    }

    if (post.image && fs.existsSync(path.join(rootPath, post.image))) {
      fs.unlinkSync(path.join(rootPath, post.image));
    }

    const postImgInterceptor = FileInterceptor('file', {
      fileFilter: fileFilter('image'),
      limits: {
        fileSize: parseInt(process.env['IMG_POST_MAX_SIZE'] || '204800'),
      },
      storage: diskStorage({
        destination: function (_, __, cb) {
          const newPath = path.join(rootPath, `uploads/posts/${post.id}`);
          if (!fs.existsSync(newPath)) {
            fs.mkdirSync(newPath, { recursive: true });
          }
          cb(null, `./uploads/posts/${post.id}`);
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

    return new postImgInterceptor().intercept(context, next);
  }
}
