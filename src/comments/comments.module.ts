import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    DatabaseModule,
    forwardRef(() => PostsModule),
    forwardRef(() => UsersModule),
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
