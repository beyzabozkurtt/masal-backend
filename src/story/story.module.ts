import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from './schemas/story.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // 💜

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: User.name, schema: UserSchema },
    ]),
    CloudinaryModule, // 💥 Buraya taşıyoruz
  ],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
