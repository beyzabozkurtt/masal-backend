import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Begeni } from './schemas/begeni.schema';
import { Story } from 'src/story/schemas/story.schema';

@Injectable()
export class BegeniService {
  constructor(
    @InjectModel(Begeni.name)
    private readonly begeniModel: Model<Begeni>,

    @InjectModel(Story.name)
    private readonly storyModel: Model<Story>,
  ) {}

  async toggleBegeni(
    storyId: string,
    userId: string,
  ): Promise<{ liked: boolean; likesCount: number }> {
    const existing = await this.begeniModel.findOne({ storyId, userId });
  
    if (existing) {
      // Kullanıcı daha önce beğenmişse → beğeniyi kaldır
      await this.begeniModel.deleteOne({ _id: existing._id });
    } else {
      // Beğeni yoksa → yeni beğeni oluştur
      await this.begeniModel.create({ storyId, userId });
    }
  
    // ✅ likesCount'ı her işlemden sonra güncel olarak hesapla
    const totalLikes = await this.begeniModel.countDocuments({ storyId });
  
    // ✅ Story'ye güncel beğeni sayısını yaz
    await this.storyModel.findByIdAndUpdate(storyId, {
      likesCount: totalLikes,
    });
  
    return {
      liked: !existing,
      likesCount: totalLikes,
    };
  }
  
  
}
