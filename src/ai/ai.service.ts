import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateStory(dto: {
    title: string;
    theme: string;
    characters: string[];
    starter: string;
  }): Promise<string> {
    const { title, theme, characters, starter } = dto;

    const prompt = `
3-8 yaş arası çocuklara uygun, pozitif, eğitici, şiddet içermeyen bir masal yaz:

Başlık: ${title}
Tema: ${theme}
Karakterler: ${characters.join(', ')}
Başlangıç: ${starter}

Masalı tamamla ve sonunda "Son." yaz.
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const message = response.choices[0].message?.content;
    if (!message) throw new Error('AI mesajı boş geldi');

    return message.trim();
  }

  // --- Yeni eklenen metod: Görsel oluşturma ---
  async generateImage(dto: {
  title: string;
  theme: string;
  characters: string[];
}): Promise<string> {
  const prompt = `
    A highly detailed, photo-realistic, colorful and beautiful scene for a children's storybook.
    Characters: ${dto.characters.join(', ')} depicted in realistic cartoon style with natural colors and expressive faces.
    Background: beautiful, natural landscape, vibrant and magical.
    No text, no letters, no watermark anywhere in the image.
    High definition, 8k resolution quality.
    `;

  const response = await this.openai.images.generate({
    prompt,
    n: 1,
    size: '512x512',
  });

  if (!response.data || response.data.length === 0) {
    throw new Error('Görsel oluşturulamadı');
  }

  const imageUrl = response.data[0].url;
  if (!imageUrl) {
    throw new Error('Görsel URL\'si alınamadı');
  }

  return imageUrl;
}

}
