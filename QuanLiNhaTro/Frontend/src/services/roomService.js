import api from '../config/api';

class RoomService {
  /**
   * Lấy danh sách phòng
   */
  async getRooms(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/rooms?${params}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách phòng trống
   */
  async getAvailableRooms() {
    try {
      const response = await api.get('/rooms/available');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin phòng
   */
  async getRoom(id) {
    try {
      const response = await api.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  }

  /**
   * Tạo phòng mới
   */
  async createRoom(data) {
    try {
      const response = await api.post('/rooms', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật phòng
   */
  async updateRoom(id, data) {
    try {
      const response = await api.put(`/rooms/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa phòng
   */
  async deleteRoom(id) {
    try {
      const response = await api.delete(`/rooms/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload ảnh cho phòng
   */
  async uploadRoomImages(roomId, files) {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      
      const response = await api.post(`/rooms/${roomId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa ảnh của phòng
   */
  async deleteRoomImage(roomId, imageUrl) {
    try {
      const response = await api.delete(`/rooms/${roomId}/images`, {
        data: { imageUrl }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const roomService = new RoomService();
