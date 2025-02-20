import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [MulterModule.register(), UsersModule, PostsModule],
  controllers: [UploadController],
})
export class UploadModule {}
