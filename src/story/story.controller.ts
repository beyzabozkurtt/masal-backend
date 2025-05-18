import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Request,
    UseGuards,
    Patch,
    Query
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { StoryService } from './story.service';
  import { CreateStoryDto } from './dto/create-story.dto';
  import { UpdateStoryDto } from './dto/update-story.dto';
  
  @Controller('story')
  export class StoryController {
    constructor(private readonly storyService: StoryService) {}
  
    // ✅ Masal oluşturma (sadece giriş yapan kullanıcı)
    @Post()
    @UseGuards(AuthGuard('jwt'))
    createStory(@Body() dto: CreateStoryDto, @Request() req) {
      return this.storyService.create(dto, req.user.userId);
    }
  
    // ✅ Sadece giriş yapan kullanıcının kendi masalları
    @Get('my-stories')
    @UseGuards(AuthGuard('jwt'))
    getMyStories(@Request() req) {
      return this.storyService.findByUser(req.user.userId);
    }
    @Get('top-stories')
    getTopStories(@Query('limit') limit: string) {
      return this.storyService.getTopStories(Number(limit) || 3);
    }
    @Get('public-stories')
    getPublicStories(@Query('theme') theme?: string) {
      return this.storyService.findPublicFiltered(theme);
    }


  
    // ✅ Masal güncelleme (sadece sahibi güncelleyebilir)
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    updateStory(@Param('id') id: string, @Body() dto: UpdateStoryDto, @Request() req) {
      return this.storyService.update(id, dto, req.user.userId);
    }
  
    // ✅ Masal silme (sadece sahibi silebilir)
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    deleteStory(@Param('id') id: string, @Request() req) {
      return this.storyService.delete(id, req.user.userId);
    }

    @Patch(':id/Begeni')
     BegeniStory(@Param('id') id: string) {
      console.log('BEĞENİ ISTEGI GELDI:', id);
     return this.storyService.incrementLike(id);
}

   @Get(':id')
     getOneStory(@Param('id') id: string) {
     return this.storyService.getOne(id);
}

   



  }
  