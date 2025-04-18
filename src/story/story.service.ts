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
  }
  