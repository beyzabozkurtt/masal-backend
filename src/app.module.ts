import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';  
import { UserModule } from './user/user.module'; 
import { StoryModule } from './story/story.module';
import { AiModule } from './ai/ai.module';
import { BegeniModule } from './begeni/begeni.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,   
    UserModule, StoryModule, AiModule,BegeniModule
  ],
  
})
export class AppModule {}
