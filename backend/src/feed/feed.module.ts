import { Module } from '@nestjs/common';
import { FeedService } from './service/feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from './service/models/post.entity';
import { FeedController } from './controllers/feed.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([FeedPostEntity])
  ],
  controllers: [  FeedController],
  providers: [FeedService],
})
export class FeedModule {}
