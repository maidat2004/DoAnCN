import api from '../config/api';

class UserService {
  /**
   * Lấy danh sách tất cả users
   */
  async getUsers(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);

      const queryString = params.toString();
      const response = await api.get(`/users${queryString ? `?${queryString}` : ''}`);
      
      if (response.success) {
        return response.data;
      }
      throw new Error('Không thể tải danh sách người dùng');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy thông tin user theo ID
   */
  async getUser(id) {
    try {
      const response = await api.get(`/users/${id}`);
      if (response.success) {
        return response.data;
      }
      throw new Error('Không tìm thấy người dùng');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật user
   */
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      if (response.success) {
        return response.data;
      }
      throw new Error('Không thể cập nhật người dùng');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa user
   */
  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      if (response.success) {
        return response.data;
      }
      throw new Error('Không thể xóa người dùng');
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
