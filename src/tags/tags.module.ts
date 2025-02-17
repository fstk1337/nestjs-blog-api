import { forwardRef, Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [DatabaseModule, forwardRef(() => PostsModule)],
  exports: [TagsService],
})
export class TagsModule {}
