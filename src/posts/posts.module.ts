import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [DatabaseModule, UsersModule, CategoriesModule],
  exports: [PostsService],
})
export class PostsModule {}
