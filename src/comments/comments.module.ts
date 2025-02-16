import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { DatabaseModule } from 'src/core/database/database.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [DatabaseModule],
})
export class CommentsModule {}
