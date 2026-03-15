import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

@Controller('blogs')
@UseGuards(JwtAuthGuard)
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Post()
  create(@Request() req: any, @Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(req.user.id, createBlogDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.blogsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.blogsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(id, req.user.id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.blogsService.remove(id, req.user.id);
  }
}
