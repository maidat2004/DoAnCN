import api from '../config/api';

class TenantService {
  /**
   * Lấy danh sách người thuê
   */
  async getTenants(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/tenants?${params}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tenants:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin người thuê theo user ID
   */
  async getTenantByUser(userId) {
    try {
      const response = await api.get(`/tenants/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tenant by user:', error);
      return null;
    }
  }

  /**
   * Lấy thông tin người thuê
   */
  async getTenant(id) {
    try {
      const response = await api.get(`/tenants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tenant:', error);
      throw error;
    }
  }

  /**
   * Tạo người thuê mới
   */
  async createTenant(data) {
    try {
      const response = await api.post('/tenants', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật người thuê
   */
  async updateTenant(id, data) {
    try {
      const response = await api.put(`/tenants/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa người thuê
   */
  async deleteTenant(id) {
    try {
      const response = await api.delete(`/tenants/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const tenantService = new TenantService();
