import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Begeni } from './schemas/begeni.schema';

@Injectable()
export class BegeniService {
  constructor(
    @InjectModel(Begeni.name)
    private readonly begeniModel: Model<Begeni>,
  ) {}

  async toggleBegeni(storyId: string, userId: string): Promise<string> {
    const existing = await this.begeniModel.findOne({ storyId, userId });

    if (existing) {
      await this.begeniModel.deleteOne({ _id: existing._id });
      return 'Beğeni kaldırıldı';
    } else {
      await this.begeniModel.create({ storyId, userId });
      return 'Beğenildi';
    }
  }
}
