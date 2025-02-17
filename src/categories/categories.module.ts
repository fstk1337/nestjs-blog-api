import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [DatabaseModule, forwardRef(() => PostsModule)],
  exports: [CategoriesService],
})
export class CategoriesModule {}
