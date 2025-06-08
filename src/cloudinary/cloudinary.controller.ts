// src/cloudinary/cloudinary.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  async uploadImage(@Body('imageUrl') imageUrl: string) {
    const secureUrl = await this.cloudinaryService.uploadFromUrl(imageUrl);
    return { secureUrl };
  }
}
