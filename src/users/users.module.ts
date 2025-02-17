import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DatabaseModule, forwardRef(() => CommentsModule)],
  exports: [UsersService],
})
export class UsersModule {}
