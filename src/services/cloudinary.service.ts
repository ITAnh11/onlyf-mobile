import axios from 'axios';
import ProfileService from './profile.service';

export class CloudinaryService {
  static CLOUD_NAME = 'dgusdhump';
  static UPLOAD_PRESET = 'video_upload_preset';

  static async uploadVideo_post(uri: string): Promise<{
    urlPublicVideo: string;
    hlsUrlVideo: string;
    publicId: string;
  } | null> {
    try {
      const formData = new FormData();

      formData.append('file', {
        uri: uri,
        name: 'video.mp4',
        type: 'video/mp4',
      } as any);

      formData.append('upload_preset', this.UPLOAD_PRESET);
      formData.append('resource_type', 'video');

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/video/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const originalUrl = res.data.secure_url;
      const optimizedUrl = originalUrl.replace('/upload/', '/upload/q_auto,f_auto/');
      const hlsUrlVideo = res.data.eager?.[0]?.secure_url || '';
      const publicId = res.data.public_id;

      return {urlPublicVideo : optimizedUrl, hlsUrlVideo, publicId };
    } catch (error: any) {
      console.error('Upload video error:', error.response?.data || error.message);
      return null;
    }
  }
}
