import {
    Controller,
    Post,
    Param,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { BegeniService } from './begeni.service';
  
  @Controller('begeni')
  export class BegeniController {
    constructor(private readonly begeniService: BegeniService) {}
  
    // POST /begeni/:storyId → toggle mantığı: varsa kaldır, yoksa beğen
    @Post(':storyId')
    @UseGuards(AuthGuard('jwt'))
    async toggleBegeni(@Param('storyId') storyId: string, @Request() req) {
      const userId = req.user.userId;
      return await this.begeniService.toggleBegeni(storyId, userId);
    }
  }
  