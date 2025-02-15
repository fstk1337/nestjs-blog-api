import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { DatabaseModule } from 'src/core/database/database.module';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [DatabaseModule],
})
export class TagsModule {}
