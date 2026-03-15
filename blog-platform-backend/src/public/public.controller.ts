import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { PublicService } from './public.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('feed')
  async getFeed(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.publicService.getFeed(parseInt(page), parseInt(limit));
  }

  @Get('blogs/:slug')
  async getBlogBySlug(@Param('slug') slug: string) {
    return this.publicService.getBlogBySlug(slug);
  }

  @Post('blogs/:id/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async likeBlog(@Param('id') blogId: string, @Request() req: any) {
    return this.publicService.likeBlog(blogId, req.user.id);
  }

  @Delete('blogs/:id/like')
  @UseGuards(JwtAuthGuard)
  async unlikeBlog(@Param('id') blogId: string, @Request() req: any) {
    return this.publicService.unlikeBlog(blogId, req.user.id);
  }

  @Post('blogs/:id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('id') blogId: string,
    @Body() body: { content: string },
    @Request() req: any,
  ) {
    return this.publicService.addComment(blogId, req.user.id, body.content);
  }

  @Get('blogs/:id/comments')
  async getComments(
    @Param('id') blogId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.publicService.getComments(blogId, parseInt(page), parseInt(limit));
  }
}
