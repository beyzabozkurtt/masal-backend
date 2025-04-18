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
    const fullStory = await this.aiService.generateStory(dto);
    const newStory = await this.storyService.create({ ...dto, fullStory }, req.user.userId);
    return newStory;
  }
}
