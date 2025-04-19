import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Begeni extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true })
  storyId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const BegeniSchema = SchemaFactory.createForClass(Begeni);
