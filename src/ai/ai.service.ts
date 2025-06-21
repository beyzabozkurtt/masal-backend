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
3-8 yaş arası çocuklar için eğitici, pozitif, yaratıcı ve şiddet içermeyen bir masal yaz. Masalın olay örgüsü yaş grubuna uygun, merak uyandıran, duygusal ve mantıklı olmalı. Masal dili sade, akıcı ve çocukların anlayabileceği düzeyde Türkçe ve türkçe yazım kurallarına uygun şekilde olmalı. Karakterler eğlenceli, sevimli ve çocuklarla empati kurabilecek özelliklerde olsun.

Masalda şu bilgiler kullanılmalı:
- Başlık: ${title}
- Tema: ${theme}
- Karakterler: ${characters.join(', ')}
- Masalın ilk cümlesi: "${starter}"

Masal çocuklara seçtiği temayla alakalı değerleri hissettirmeli ama öğretici bir tonla değil, doğal, olay örgüsü çocuklara uygun,eğlenceli,merak uyandıran,öğretici hikâyesel akışla anlatılmalı.

Masalın sonunda sadece şu kelime yazmalı: "Son." 
Bu kelimeden sonra hiçbir cümle gelmemeli.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.75,
        max_tokens: 1000,
      });

      const message = response.choices[0].message?.content;
      if (!message) throw new Error('AI mesajı boş geldi');

      // Ek güvenlik: "Son." kelimesinden sonrasını sil
      const trimmed = message.trim();
      const endIndex = trimmed.indexOf('Son.');
      return endIndex !== -1 ? trimmed.substring(0, endIndex + 4).trim() : trimmed;
    } catch (error) {
      console.error('Masal oluşturma hatası:', error);
      throw new Error('Masal oluşturulurken bir hata oluştu.');
    }
  }

  async generateImage(dto: {
    title: string;
    theme: string;
    characters: string[];
  }): Promise<string> {
   const prompt = `
A centered and balanced composition showing cute, cartoon-style characters: ${dto.characters.join(', ')}.
Each character should be fully visible, with clear and expressive faces.
Set in a magical, fairytale forest with soft lighting.
No text or logos, high quality children's book illustration.
`.trim();






    try {
      const response = await this.openai.images.generate({
        prompt,
        n: 1,
        size: '512x512',
      });

      const imageUrl = response.data?.[0]?.url;
      if (!imageUrl) {
        throw new Error('Görsel URL\'si alınamadı');
      }

      return imageUrl;
    } catch (error) {
      console.error('Görsel oluşturma hatası:', error);
      throw new Error('Görsel oluşturulamadı.');
    }
  }
}
