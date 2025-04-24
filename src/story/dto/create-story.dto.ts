import { IsString, IsBoolean, IsEnum, IsArray, ArrayNotEmpty } from 'class-validator';
import { StoryTheme } from '../enums/theme.enum';


export class CreateStoryDto {
  @IsString()
  title: string;

  @IsEnum(StoryTheme)
  theme: StoryTheme;

  @IsArray()
  @ArrayNotEmpty()
  characters: string[];

  @IsString()
  starter: string;

  
  @IsString()
  fullStory: string; 
  
  @IsBoolean()
  isPublic: boolean;


}
