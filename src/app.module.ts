import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { UploadModule } from './core/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import configuration from './core/config/configuration';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    TagsModule,
    CommentsModule,
    PostsModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
})
export class AppModule {}
