import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService], // Dışarıya açıyoruz ki diğer modüller kullanabilsin
})
export class CloudinaryModule {}
