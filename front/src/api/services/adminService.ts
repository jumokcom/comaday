import apiClient from '../apiClient';
import { User } from '../../types/user';

export const adminService = {
  async getNewUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/admin/new-users');
    return response.data;
  },

  async approveNewUser(userId: number): Promise<User> {
    const response = await apiClient.post<User>(`/admin/users/${userId}/approve`);
    return response.data;
  },

  async rejectNewUser(userId: number): Promise<void> {
    await apiClient.post(`/admin/users/${userId}/reject`);
  },

  async sendCoinsToUser(userId: number, amount: number): Promise<User> {
    const response = await apiClient.post<User>(`/admin/users/${userId}/send-coins`, { amount });
    return response.data;
  },

  async grantAdmin(userId: number): Promise<User> {
    const response = await apiClient.post<User>(`/admin/users/${userId}/grant-admin`);
    return response.data;
  },

  async revokeAdmin(userId: number): Promise<User> {
    const response = await apiClient.post<User>(`/admin/users/${userId}/revoke-admin`);
    return response.data;
  }
}; 