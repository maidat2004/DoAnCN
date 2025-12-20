import api from '../config/api';

class ContractService {
  /**
   * Lấy danh sách hợp đồng
   */
  async getContracts(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/contracts?${params}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  }

  /**
   * Lấy hợp đồng theo tenant
   */
  async getContractsByTenant(tenantId) {
    try {
      const response = await api.get(`/contracts/tenant/${tenantId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tenant contracts:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin hợp đồng
   */
  async getContract(id) {
    try {
      const response = await api.get(`/contracts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contract:', error);
      throw error;
    }
  }

  /**
   * Tạo hợp đồng mới
   */
  async createContract(data) {
    try {
      const response = await api.post('/contracts', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật hợp đồng
   */
  async updateContract(id, data) {
    try {
      const response = await api.put(`/contracts/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa hợp đồng
   */
  async deleteContract(id) {
    try {
      const response = await api.delete(`/contracts/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const contractService = new ContractService();
