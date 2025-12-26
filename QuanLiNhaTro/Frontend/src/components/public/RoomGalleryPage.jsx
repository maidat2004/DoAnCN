import { useState, useEffect } from 'react';
import { roomService } from '../../services';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function RoomGalleryPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (error) {
      toast.error('Không thể tải danh sách phòng');
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const openGallery = (room) => {
    setSelectedRoom(room);
    setCurrentImageIndex(0);
  };

  const closeGallery = () => {
    setSelectedRoom(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedRoom && selectedRoom.images && selectedRoom.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedRoom.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedRoom && selectedRoom.images && selectedRoom.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedRoom.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang tải danh sách phòng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🏠 Phòng Trọ Của Chúng Tôi
          </h1>
          <p className="text-xl text-gray-600">
            Khám phá các phòng trọ chất lượng cao với đầy đủ tiện nghi
          </p>
        </div>

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-2xl text-gray-600 font-semibold">Chưa có phòng trọ nào</p>
            <p className="text-gray-500 mt-2">Vui lòng quay lại sau</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
                onClick={() => room.images && room.images.length > 0 && openGallery(room)}
              >
                {/* Room Image */}
                <div className="relative h-64 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                  {room.images && room.images.length > 0 ? (
                    <>
                      <img
                        src={`http://localhost:5000${room.images[0]}`}
                        alt={`Phòng ${room.roomNumber}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                        }}
                      />
                      <div className="fallback-icon hidden items-center justify-center h-full">
                        <span className="text-white text-6xl">🏠</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-white text-6xl">🏠</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-blue-600 font-bold">Phòng {room.roomNumber}</span>
                  </div>
                  {room.images && room.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-white" />
                      <span className="text-white font-semibold">{room.images.length} ảnh</span>
                    </div>
                  )}
                </div>

                {/* Room Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Phòng {room.roomNumber}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      room.status === 'available' ? 'bg-green-100 text-green-700' :
                      room.status === 'occupied' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {room.status === 'available' ? '✅ Trống' :
                       room.status === 'occupied' ? '👥 Đã thuê' :
                       '🔧 Bảo trì'}
                    </span>
                  </div>

                  {room.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                  )}

                  {/* Room Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Diện tích</p>
                      <p className="font-bold text-gray-800">{room.area}m²</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Sức chứa</p>
                      <p className="font-bold text-gray-800">{room.capacity} người</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Giá thuê</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(room.price)}</p>
                      <p className="text-xs text-gray-500">/ tháng</p>
                    </div>
                    {room.images && room.images.length > 0 && (
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
                        Xem ảnh →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Gallery Modal */}
        {selectedRoom && selectedRoom.images && selectedRoom.images.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            {/* Close Button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {selectedRoom.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Main Content */}
            <div className="w-full max-w-6xl">
              {/* Image */}
              <div className="relative mb-6">
                <img
                  src={`http://localhost:5000${selectedRoom.images[currentImageIndex]}`}
                  alt={`Phòng ${selectedRoom.roomNumber} - ${currentImageIndex + 1}`}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-2xl"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%234F46E5" width="800" height="600"/%3E%3Ctext fill="white" font-size="48" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🏠 Phòng ' + selectedRoom.roomNumber + '%3C/text%3E%3C/svg%3E';
                  }}
                />
                
                {/* Image Counter */}
                {selectedRoom.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white font-semibold">
                      {currentImageIndex + 1} / {selectedRoom.images.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Room Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Phòng {selectedRoom.roomNumber}</h2>
                    <p className="text-blue-200 mb-2">Tầng {selectedRoom.floor}</p>
                    {selectedRoom.description && (
                      <p className="text-gray-300">{selectedRoom.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">Giá thuê</p>
                    <p className="text-3xl font-bold text-yellow-400">{formatCurrency(selectedRoom.price)}</p>
                    <p className="text-sm text-gray-300">/ tháng</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-300 mb-1">Diện tích</p>
                    <p className="font-bold text-lg">{selectedRoom.area}m²</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-300 mb-1">Sức chứa</p>
                    <p className="font-bold text-lg">{selectedRoom.capacity} người</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-300 mb-1">Trạng thái</p>
                    <p className="font-bold text-lg">
                      {selectedRoom.status === 'available' ? '✅ Trống' :
                       selectedRoom.status === 'occupied' ? '👥 Đã thuê' :
                       '🔧 Bảo trì'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {selectedRoom.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {selectedRoom.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-blue-500 scale-110'
                          : 'border-white/20 opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={`http://localhost:5000${img}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-700"><span class="text-2xl">🏠</span></div>';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Bạn quan tâm đến phòng nào?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Liên hệ ngay để được tư vấn và xem phòng trực tiếp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Đăng nhập để đặt phòng
            </a>
            <a
              href="tel:0123456789"
              className="inline-block px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📞 Gọi ngay: 0123-456-789
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
