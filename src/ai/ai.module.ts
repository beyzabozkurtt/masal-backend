import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { StoryModule } from '../story/story.module'; // ✅ Bunu ekle

@Module({
  imports: [StoryModule], // ✅ Bunu da içeri ekle
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
