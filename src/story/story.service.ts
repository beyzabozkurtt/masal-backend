import {
    Injectable,
    ForbiddenException,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model, isValidObjectId } from 'mongoose';
  import { Story } from './schemas/story.schema';
  import { CreateStoryDto } from './dto/create-story.dto';
  import { UpdateStoryDto } from './dto/update-story.dto';
  import { StoryTheme } from '../story/enums/theme.enum';
  import { CloudinaryService } from '../cloudinary/cloudinary.service';

  
  
  @Injectable()
  export class StoryService {
  constructor(
  @InjectModel(Story.name) private readonly storyModel: Model<Story>,
  private readonly cloudinaryService: CloudinaryService,
) {}
  
  async create(dto: CreateStoryDto, userId: string): Promise<Story> {
  // ⛔ Blob görsel linklerini engelle
  
  const newStory = new this.storyModel({
    ...dto,
    userRef: userId,
  });

  return newStory.save();
}


  
    async findByUser(userId: string): Promise<Story[]> {
      return await this.storyModel.find({ userRef: userId });
    }
  
    async findPublic(): Promise<Story[]> {
      return await this.storyModel.find({ isPublic: true });
    }
  
    async update(id: string, dto: UpdateStoryDto, userId: string): Promise<Story> {
      if (!isValidObjectId(id)) throw new BadRequestException('Geçersiz ID');
  
      const story = await this.storyModel.findById(id);
      if (!story) throw new NotFoundException('Masal bulunamadı');
      if (story.userRef.toString() !== userId)
        throw new ForbiddenException('Yetkisiz işlem');
  
      const updated = await this.storyModel.findByIdAndUpdate(id, dto, { new: true });
      if (!updated) throw new NotFoundException('Masal güncellenemedi');
      return updated;
      
    }
  
    async delete(id: string, userId: string): Promise<any> {
      if (!isValidObjectId(id)) throw new BadRequestException('Geçersiz ID');
  
      const story = await this.storyModel.findById(id);
      if (!story) throw new NotFoundException('Masal bulunamadı');
      if (story.userRef.toString() !== userId)
        throw new ForbiddenException('Yetkisiz işlem');
  
      return await this.storyModel.findByIdAndDelete(id);
    }

    async incrementLike(id: string) {
      return this.storyModel.findByIdAndUpdate(
        id,
        { $inc: { likesCount: 1 } },
        { new: true }
      );
    }

    async getOne(id: string): Promise<Story> {
      if (!isValidObjectId(id)) throw new BadRequestException('Geçersiz ID');
    
      const story = await this.storyModel
        .findById(id)
        .populate('userRef', 'name') // 👈 Yazar bilgisi
        .select('title fullStory likesCount theme characters userRef'); // 👈 Gerekli tüm alanlar
    
      if (!story) throw new NotFoundException('Masal bulunamadı');
    
      return story;
    }
    
    

    async getTopStories(limit: number = 10): Promise<Story[]> {
      return this.storyModel
        .find({ isPublic: true })                  // sadece herkese açık masallar
        .sort({ likesCount: -1 })                  // en çok beğenilenden başlayarak sırala
        .limit(limit)                              // belirli sayıda getir (varsayılan: 10)
        .populate('userRef', 'name')
        .select('title fullStory likesCount theme userRef'); // sadece gerekli alanları döndür
    }


async findPublicFiltered(theme?: string, limit: number = 30): Promise<Story[]> {
  const query: any = { isPublic: true };

  if (theme) {
    query.theme = { $regex: new RegExp(`^${theme.trim()}$`, 'i') };
  }

  return this.storyModel
    .find(query)
    .limit(limit) // daima limit olsun
    .sort({ createdAt: -1 })
    .select('title theme fullStory imageUrl userRef createdAt likesCount') // gerekli alanlar
    .populate('userRef', 'name') // sadece yazar ismi
    .lean(); // performans için: mongoose document değil, düz object döndür
}

    
}   
    