import { Controller, Get } from '@nestjs/common';
import { TestPostService } from './test-post.service';

@Controller('posts')
export class TestPostController {
  constructor(private readonly postService: TestPostService) {}

  @Get('/test-post')
  getPosts() {
    return this.postService.getAllPosts();
  }

  // @Post('/test-post')
  // createPost(@Body('title') title: string, @Body('body') body: string) {
  //   return this.postService.createPost(title, body);
  // }
}
