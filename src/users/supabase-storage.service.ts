import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

@Injectable()
export class SupabaseStorageService {
  private readonly supabase: SupabaseClient;
  private readonly bucket = 'avatars';

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    this.supabase = createClient(supabaseUrl, supabaseSecretKey);
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const extension = file.originalname.split('.').pop()?.toLowerCase();

    const filePath = `${userId}/${randomUUID()}.${extension}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível enviar o avatar.',
      );
    }

    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}
