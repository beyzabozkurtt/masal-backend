import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StoryTheme } from '../enums/theme.enum';


@Schema({ timestamps: true })
export class Story extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ enum: StoryTheme })
 theme: StoryTheme;

  @Prop([String])
  characters: string[];

  @Prop({ required: true })
  starter: string;

  @Prop()
  fullStory: string;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userRef: Types.ObjectId;
}

export const StorySchema = SchemaFactory.createForClass(Story);
