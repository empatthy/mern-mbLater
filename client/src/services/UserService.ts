import { AxiosResponse } from 'axios';
import { IUser } from '../models/IUser';
import $api from '../http';

export default class UserService {
  static async fetchUser(userId: any): Promise<AxiosResponse<IUser>> {
    return await $api.get<IUser>(`/api/users/getUser/${userId}`);
  }
}
