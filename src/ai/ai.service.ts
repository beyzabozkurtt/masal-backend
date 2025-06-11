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
3-8 yaş arası çocuklar için yaratıcı, pozitif, eğitici ve şiddet içermeyen bir masal yaz. Masal şu bilgileri içermeli:

- Başlık: ${title}
- Tema: ${theme}
- Karakterler: ${characters.join(', ')}
- Başlangıç cümlesi: "${starter}"

Masal, çocukların hayal gücünü geliştirsin ve dostluk, yardımlaşma, empati gibi değerleri öğretsin. Masal sonunda "Son." yazmalı. Masal sade, akıcı ve yaş grubuna uygun bir Türkçe ile yazılmalı.
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

  async generateImage(dto: {
    title: string;
    theme: string;
    characters: string[];
  }): Promise<string> {
    const prompt = `
A highly detailed, colorful and beautiful illustration for a children's storybook.

Scene: A magical and imaginative environment matching the theme "${dto.theme}". Include elements that evoke joy, wonder, and nature.

Characters: ${dto.characters.join(', ')} – depicted in a realistic cartoon style, child-friendly with natural proportions and expressive, friendly faces.

Style: Bright colors, soft lighting, realistic textures. Resembling a Pixar-like illustration.

No text, no letters, no watermark. High definition, 8k resolution. No background blur.
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
      throw new Error("Görsel URL'si alınamadı");
    }

    return imageUrl;
  }
}
