import { ApiService, API_ENDPOINTS, ApiResponse } from '../api';

export interface MediaUploadResponse {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
}

export class MediaService {
  /**
   * Upload avatar image to backend
   * @param file - Avatar file to upload
   * @returns Media object with id and url
   */
  static async uploadAvatar(file: File): Promise<ApiResponse<MediaUploadResponse>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Backend returns: { success: true, doc: {...} }
      // Need to normalize to ApiResponse format: { success, data: {...} }
      const response = await ApiService.postFormData<any>(
        API_ENDPOINTS.MEDIA.UPLOAD,
        formData
      );

      if (response.success && response.doc) {
        // Normalize: extract doc and map to data field
        return {
          success: true,
          data: {
            id: response.doc.id,
            url: response.doc.url,
            filename: response.doc.filename,
            mimeType: response.doc.mimeType,
            filesize: response.doc.filesize,
          },
        };
      }

      return response;
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      return {
        success: false,
        error: error?.message || 'Loi upload avatar',
      };
    }
  }
}
