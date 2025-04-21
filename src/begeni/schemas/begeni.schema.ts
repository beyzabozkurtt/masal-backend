import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Begeni extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Story', required: true })
  storyId: Types.ObjectId;
}

export const BegeniSchema = SchemaFactory.createForClass(Begeni);

// ✅ Composite index tanımı (doğrudan schema'ya)
BegeniSchema.index({ userId: 1, storyId: 1 }, { unique: true });
