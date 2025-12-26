import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { roomService } from '../../services';
import { Search, MapPin, DollarSign, Home, Phone, Mail, Clock } from 'lucide-react';

export default function AboutPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterArea, setFilterArea] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (error) {
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

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea === 'all' || 
                       (filterArea === 'small' && room.area < 20) ||
                       (filterArea === 'medium' && room.area >= 20 && room.area < 30) ||
                       (filterArea === 'large' && room.area >= 30);
    return matchesSearch && matchesArea;
  });

  // Get latest rooms (newest 5)
  const latestRooms = rooms.slice().sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            🏠 Tìm Phòng Trọ Lý Tưởng
          </h1>
          <p className="text-xl text-center text-blue-100 mb-8">
            Khám phá hơn 100+ phòng trọ chất lượng với giá cả phù hợp
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo số phòng hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Room List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Danh Sách Phòng Trọ
              </h2>
              <p className="text-gray-600">
                Hiển thị {filteredRooms.length} phòng
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Đang tải...</p>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Không tìm thấy phòng nào
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRooms.map((room) => (
                  <div key={room._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
                    <div className="md:flex">
                      {/* Room Image */}
                      <div className="md:w-1/3 h-64 md:h-auto bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
                        {room.images && room.images.length > 0 ? (
                          <img
                            src={`http://localhost:5000${room.images[0]}`}
                            alt={`Phòng ${room.roomNumber}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.querySelector('.fallback').style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="fallback hidden items-center justify-center h-full">
                          <span className="text-white text-6xl">🏠</span>
                        </div>
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-blue-600 font-bold">Phòng {room.roomNumber}</span>
                        </div>
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full font-semibold text-sm ${
                          room.status === 'available' ? 'bg-green-500 text-white' :
                          room.status === 'occupied' ? 'bg-blue-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {room.status === 'available' ? '✅ Trống' :
                           room.status === 'occupied' ? '👥 Đã thuê' :
                           '🔧 Bảo trì'}
                        </div>
                      </div>

                      {/* Room Info */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            Phòng {room.roomNumber} - Tầng {room.floor}
                          </h3>
                        </div>

                        {room.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {room.description}
                          </p>
                        )}

                        {/* Room Details Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Home className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Diện tích</p>
                              <p className="font-semibold">{room.area}m²</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg">👥</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Sức chứa</p>
                              <p className="font-semibold">{room.capacity} người</p>
                            </div>
                          </div>
                        </div>

                        {/* Price and Action */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-500">Giá thuê</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatCurrency(room.price)}
                              <span className="text-sm text-gray-500 font-normal">/tháng</span>
                            </p>
                          </div>
                          <Link
                            to="/phong-tro"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                          >
                            Chi tiết →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Filter by Area */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📏</span>
                Lọc theo diện tích
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setFilterArea('all')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    filterArea === 'all' 
                      ? 'bg-blue-500 text-white font-semibold shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả phòng
                </button>
                <button
                  onClick={() => setFilterArea('small')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    filterArea === 'small' 
                      ? 'bg-blue-500 text-white font-semibold shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dưới 20m² (Nhỏ)
                </button>
                <button
                  onClick={() => setFilterArea('medium')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    filterArea === 'medium' 
                      ? 'bg-blue-500 text-white font-semibold shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  20-30m² (Trung bình)
                </button>
                <button
                  onClick={() => setFilterArea('large')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    filterArea === 'large' 
                      ? 'bg-blue-500 text-white font-semibold shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Trên 30m² (Lớn)
                </button>
              </div>
            </div>

            {/* Latest Rooms */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🆕</span>
                Phòng mới đăng
              </h3>
              <div className="space-y-3">
                {latestRooms.slice(0, 5).map((room) => (
                  <Link
                    key={room._id}
                    to="/phong-tro"
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {room.images && room.images.length > 0 ? (
                        <img
                          src={`http://localhost:5000${room.images[0]}`}
                          alt={`Phòng ${room.roomNumber}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-white text-2xl">🏠</span>';
                          }}
                        />
                      ) : (
                        <span className="text-white text-2xl">🏠</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        Phòng {room.roomNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {room.area}m² • {room.capacity} người
                      </p>
                      <p className="text-sm font-bold text-blue-600">
                        {formatCurrency(room.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📞</span>
                Liên hệ với chúng tôi
              </h3>
              <div className="space-y-3">
                <a href="tel:0123456789" className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                  <Phone className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-blue-100">Hotline</p>
                    <p className="font-semibold">0123-456-789</p>
                  </div>
                </a>
                <a href="mailto:contact@nhatro.com" className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                  <Mail className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-blue-100">Email</p>
                    <p className="font-semibold">contact@nhatro.com</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-blue-100">Giờ làm việc</p>
                    <p className="font-semibold">8:00 - 22:00 (Hàng ngày)</p>
                  </div>
                </div>
              </div>
              <a
                href="tel:0123456789"
                className="block w-full mt-4 py-3 bg-white text-blue-600 font-bold rounded-lg text-center hover:bg-blue-50 transition-all"
              >
                Gọi ngay →
              </a>
            </div>

            {/* Promo Banner */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-md p-6 text-white text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-bold mb-2">
                Ưu đãi đặc biệt!
              </h3>
              <p className="text-sm text-purple-100 mb-4">
                Miễn phí tháng đầu tiên cho khách hàng đăng ký mới
              </p>
              <Link
                to="/login"
                className="block w-full py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all"
              >
                Đăng ký ngay →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}