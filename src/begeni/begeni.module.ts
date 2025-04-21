import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Begeni, BegeniSchema } from './schemas/begeni.schema';
import { Story, StorySchema } from '../story/schemas/story.schema'; // ✅ Story modelini ekliyoruz
import { BegeniService } from './begeni.service';
import { BegeniController } from './begeni.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Begeni.name, schema: BegeniSchema },
      { name: Story.name, schema: StorySchema }, 
    ]),
  ],
  controllers: [BegeniController],
  providers: [BegeniService],
  exports: [BegeniService],
})
export class BegeniModule {}
