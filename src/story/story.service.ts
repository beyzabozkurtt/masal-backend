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
  
  
  @Injectable()
  export class StoryService {
    constructor(
      @InjectModel(Story.name) private readonly storyModel: Model<Story>,
    ) {}
  
    async create(dto: CreateStoryDto, userId: string): Promise<Story> {
      const newStory = new this.storyModel({
        ...dto,
        userRef: userId,
      });
      return await newStory.save();
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

    async findPublicFiltered(theme?: string): Promise<Story[]> {
      const query: any = { isPublic: true };

      if (theme) {
        const themeUpper = theme.toUpperCase(); // kullanıcı küçük harf yollarsa da eşleşsin
        if (!Object.keys(StoryTheme).includes(themeUpper)) {
          throw new BadRequestException('Geçersiz tema.');
        }

        query.theme = StoryTheme[themeUpper as keyof typeof StoryTheme];
      }

      return this.storyModel.find(query);
    }
  }
  