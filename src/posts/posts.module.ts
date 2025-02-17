import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { CommentsModule } from 'src/comments/comments.module';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    DatabaseModule,
    forwardRef(() => UsersModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => TagsModule),
  ],
  exports: [PostsService],
})
export class PostsModule {}
