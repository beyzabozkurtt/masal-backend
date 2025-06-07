import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService] // 💥 dışarıya açıyoruz
})
export class CloudinaryModule {}
