import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { StoryModule } from '../story/story.module'; 

@Module({
  imports: [StoryModule], 
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
