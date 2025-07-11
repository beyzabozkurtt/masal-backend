// src/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  providers: [CloudinaryService],
  controllers: [CloudinaryController], // ✔️ yeni eklenen controller
  exports: [CloudinaryService]
})
export class CloudinaryModule {}
