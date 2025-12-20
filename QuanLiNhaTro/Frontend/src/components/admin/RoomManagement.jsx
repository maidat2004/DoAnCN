import { useState, useEffect } from 'react';
import { roomService } from '../../services';

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: 1,
    area: 0,
    price: 0,
    capacity: 1,
    status: 'available',
    description: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await roomService.updateRoom(editingRoom._id, formData);
      } else {
        await roomService.createRoom(formData);
      }
      await fetchRooms();
      setShowForm(false);
      resetForm();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa phòng này?')) {
      try {
        await roomService.deleteRoom(id);
        await fetchRooms();
      } catch (error) {
        alert('Lỗi: ' + error.message);
      }
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      floor: room.floor,
      area: room.area,
      price: room.price,
      capacity: room.capacity,
      status: room.status,
      description: room.description || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      floor: 1,
      area: 0,
      price: 0,
      capacity: 1,
      status: 'available',
      description: '',
    });
  };

  if (loading) {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Quản lý phòng</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
        >
          {showForm ? 'Đóng' : '+ Thêm phòng'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">{editingRoom ? 'Sửa phòng' : 'Thêm phòng mới'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Số phòng</label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tầng</label>
              <input
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Diện tích (m²)</label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giá (đ)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sức chứa</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="available">Còn trống</option>
                <option value="occupied">Đã thuê</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
              />
            </div>
            <div className="col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                {editingRoom ? 'Cập nhật' : 'Thêm mới'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="border-2 border-dashed border-blue-300 rounded-lg bg-white min-h-[180px] flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition shadow-sm"
        >
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mb-3">+</div>
          <div className="text-lg font-semibold text-blue-700">Thêm phòng mới</div>
          <div className="text-sm text-gray-500">Nhấn để mở form</div>
        </button>

        {rooms.map((room) => (
          <div key={room._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`p-4 ${room.status === 'available' ? 'bg-green-500' : room.status === 'occupied' ? 'bg-red-500' : 'bg-yellow-500'} text-white`}>
              <h3 className="text-xl font-bold">Phòng {room.roomNumber}</h3>
              <p>Tầng {room.floor}</p>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <p><strong>Diện tích:</strong> {room.area}m²</p>
                <p><strong>Giá:</strong> {room.price?.toLocaleString('vi-VN')}đ</p>
                <p><strong>Sức chứa:</strong> {room.capacity} người</p>
                <p><strong>Trạng thái:</strong> {
                  room.status === 'available' ? 'Còn trống' :
                  room.status === 'occupied' ? 'Đã thuê' : 'Bảo trì'
                }</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(room)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(room._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating quick add button */}
      <button
        type="button"
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        className="fixed bottom-6 right-6 px-4 py-3 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 focus:outline-none"
      >
        + Thêm phòng
      </button>
    </div>
  );
}
