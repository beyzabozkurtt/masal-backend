import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.config';
import axios from 'axios';

@Injectable()
export class CloudinaryService {
  async uploadFromUrl(imageUrl: string): Promise<string> {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      return await new Promise((resolve, reject) => {
       const uploadStream = cloudinary.uploader.upload_stream(
  { resource_type: 'image' },
  (error, result) => {
    if (error) {
      console.error('Cloudinary yükleme hatası:', error);
      return reject(error);
    }

    if (!result) {
      return reject(new Error('Cloudinary sonucu boş geldi'));
    }

    resolve(result.secure_url); // 💜 Artık güvenli
  }
);


        uploadStream.end(Buffer.from(response.data, 'binary'));
      });
    } catch (err) {
      console.error('CloudinaryService uploadFromUrl HATASI:', err);
      throw err;
    }
  }
}
