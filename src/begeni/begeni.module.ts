import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Begeni, BegeniSchema } from './schemas/begeni.schema';
import { BegeniService } from './begeni.service';
import { BegeniController } from './begeni.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Begeni.name, schema: BegeniSchema }]),
  ],
  controllers: [BegeniController],
  providers: [BegeniService],
  exports: [BegeniService],
})
export class BegeniModule {}
