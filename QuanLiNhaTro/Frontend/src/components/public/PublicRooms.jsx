import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roomService } from '../../services';

export default function PublicRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getAvailableRooms();
        setRooms(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">Nhà Trọ ABC</Link>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Trang chủ</Link>
            <Link to="/phong-trong" className="text-black-600 font-semibold">Phòng trống</Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Đăng nhập
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Phòng trống hiện có</h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Hiện tại không có phòng trống</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-blue-600 text-white p-4">
                  <h3 className="text-2xl font-bold">Phòng {room.roomNumber}</h3>
                  <p className="text-blue-100">Tầng {room.floor}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diện tích:</span>
                      <span className="font-semibold">{room.area}m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sức chứa:</span>
                      <span className="font-semibold">{room.capacity} người</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Giá:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {room.price?.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                  
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Tiện nghi:</p>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 4).map((amenity, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {room.description && (
                    <p className="mt-4 text-sm text-gray-600">{room.description}</p>
                  )}

                  <Link
                    to="/login"
                    className="mt-6 block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đăng nhập để thuê
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
