import $api from '../http';
import { AxiosResponse } from 'axios';

export default class FileService {
  static async uploadAvatar(userId: string, formData: FormData): Promise<AxiosResponse> {
    return await $api.post(`/api/uploads/uploadAvatar/${userId}`, formData);
  }

  static async removeAvatar(userId: string): Promise<AxiosResponse<string>> {
    return await $api.delete('/api/uploads/removeAvatar', { data: { userId } });
  }

  static uploadPicture(formData: FormData): Promise<AxiosResponse> {
    return $api.post('/api/uploads/uploadPicture', formData);
  }
}
