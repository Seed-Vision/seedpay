import { Body, Controller, Post } from '@nestjs/common';
import { FeedService } from '../service/feed.service';
import { FeedPost } from '../service/models/post.interface';
import { Observable } from 'rxjs';


@Controller('feed')
export class FeedController {
    constructor(private feedService: FeedService) {}

    @Post()
    create(@Body() post: FeedPost): Observable<FeedPost> {
        return this.feedService.createPost(post)

    }
}
