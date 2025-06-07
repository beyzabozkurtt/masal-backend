import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { StoryService } from '../story/story.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly storyService: StoryService,
  ) {}

  @Post('generate')
  @UseGuards(AuthGuard('jwt'))
  async generateAndSave(@Body() dto: any, @Request() req) {
    console.log('GELEN DTO:', dto);

    // 1. Masal metnini oluştur
    const fullStory = await this.aiService.generateStory(dto);

    // 2. Masala uygun görseli oluştur
    const imageUrl = await this.aiService.generateImage(dto);

    // 3. Masal ve görseli veritabanına kaydet
    const newStory = await this.storyService.create(
      { ...dto, fullStory, imageUrl },
      req.user.userId,
    );

    return newStory;
  }
}
