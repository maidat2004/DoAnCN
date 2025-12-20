import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomService } from '../../services';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomService.getAllRooms();
        setRooms(response.data || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([
          { _id: '1', roomNumber: 'P101', floor: 1, price: 1500000, status: 'available', description: 'Phòng đơn thoáng mát, view công viên, ánh sáng tự nhiên. Đầy đủ nội thất cơ bản: giường, tủ quần áo, bàn học. WC riêng sạch sẽ.', area: 18, amenities: ['WiFi', 'Quạt trần', 'WC riêng'] },
          { _id: '2', roomNumber: 'P102', floor: 1, price: 1400000, status: 'available', description: 'Phòng đơn có ban công nhỏ, thoáng mát. Nội thất gồm: giường, tủ, bàn ghế. Thích hợp cho người thuê hoặc người đi làm.', area: 16, amenities: ['WiFi', 'Quạt', 'Ban công'] },
          { _id: '3', roomNumber: 'P201', floor: 2, price: 1300000, status: 'occupied', description: 'Phòng đơn yên tĩnh, phù hợp người thuê. Có giường, tủ, bàn học. WC chung sạch sẽ, rộng rãi.', area: 15, amenities: ['WiFi', 'Quạt', 'WC chung'] },
          { _id: '4', roomNumber: 'P202', floor: 2, price: 1500000, status: 'available', description: 'Phòng đơn view đẹp, gần trường học. Nội thất cơ bản đầy đủ, phòng sạch sẽ, thoáng mát. WC riêng tiện lợi.', area: 17, amenities: ['WiFi', 'Quạt trần', 'WC riêng'] },
          { _id: '5', roomNumber: 'P301', floor: 3, price: 1200000, status: 'available', description: 'Phòng đơn giá rẻ, phù hợp người thuê. Có giường, tủ đơn giản. WC chung sạch sẽ, được vệ sinh thường xuyên.', area: 14, amenities: ['WiFi', 'Quạt', 'WC chung'] },
          { _id: '6', roomNumber: 'P302', floor: 3, price: 1400000, status: 'available', description: 'Phòng đơn thoáng mát, cửa sổ lớn. Nội thất gồm giường, tủ, bàn ghế học tập. An ninh tốt, yên tĩnh.', area: 16, amenities: ['WiFi', 'Quạt trần', 'WC riêng'] },
          { _id: '7', roomNumber: 'P303', floor: 3, price: 1300000, status: 'available', description: 'Phòng đơn sạch sẽ, mới sơn lại. Có giường, tủ quần áo, bàn học. Gần siêu thị, trường học tiện lợi.', area: 15, amenities: ['WiFi', 'Quạt', 'WC chung'] },
          { _id: '8', roomNumber: 'P401', floor: 4, price: 1500000, status: 'available', description: 'Phòng đơn tầng cao, thoáng mát, view đẹp. Nội thất đầy đủ: giường, tủ, bàn ghế. WC riêng sạch sẽ.', area: 18, amenities: ['WiFi', 'Quạt trần', 'WC riêng'] },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room => {
    const statusMatch = filter === 'all' || room.status === filter;
    let priceMatch = true;
    if (priceRange === 'under1m') priceMatch = room.price < 1000000;
    else if (priceRange === '1m-1m5') priceMatch = room.price >= 1000000 && room.price <= 1500000;
    else if (priceRange === 'over1m5') priceMatch = room.price > 1500000;
    return statusMatch && priceMatch;
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      available: { text: 'Còn trống', color: 'bg-emerald-500 text-white', icon: '✓' },
      occupied: { text: 'Đã thuê', color: 'bg-rose-500 text-white', icon: '✗' },
      maintenance: { text: 'Bảo trì', color: 'bg-amber-500 text-white', icon: '⚠' }
    };
    return statusMap[status] || statusMap.available;
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);

  const roomImages = [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&h=300&fit=crop',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <span className="inline-block px-5 py-2 bg-white rounded-full text-indigo-700 text-sm font-extrabold mb-4 shadow-lg">
              🏠 Tìm kiếm phòng trọ hoàn hảo
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
              Danh Sách <span className="text-yellow-300">Phòng Trống</span>
            </h1>
            <p className="text-xl font-bold text-white max-w-2xl mx-auto drop-shadow-md">
              Khám phá các phòng trọ chất lượng cao với đầy đủ tiện nghi và mức giá hợp lý nhất
            </p>
          </div>
        </div>
        {/* Separator */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-50"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 -mt-16 relative z-20">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <span className="text-gray-500 font-medium self-center mr-2">Trạng thái:</span>
              {[
                { value: 'all', label: 'Tất cả', count: rooms.length },
                { value: 'available', label: 'Còn trống', count: rooms.filter(r => r.status === 'available').length },
                { value: 'occupied', label: 'Đã thuê', count: rooms.filter(r => r.status === 'occupied').length },
              ].map(item => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md ${
                    filter === item.value
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${filter === item.value ? 'bg-white/20' : 'bg-gray-200'}`}>{item.count}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="text-gray-500 font-medium self-center mr-2">Giá:</span>
              {[
                { value: 'all', label: 'Tất cả' },
                { value: 'under1m', label: '< 1 triệu' },
                { value: '1m-1m5', label: '1-1.5 triệu' },
                { value: 'over1m5', label: '> 1.5 triệu' },
              ].map(item => (
                <button
                  key={item.value}
                  onClick={() => setPriceRange(item.value)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all shadow-md ${
                    priceRange === item.value ? 'bg-emerald-600 text-white shadow-emerald-500/40' : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center"><span className="text-2xl">🏠</span></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{rooms.filter(r => r.status === 'available').length}</p>
              <p className="text-sm text-gray-500">Phòng trống</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><span className="text-2xl">📊</span></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{rooms.length}</p>
              <p className="text-sm text-gray-500">Tổng phòng</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><span className="text-2xl">💰</span></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">1.2-1.5tr</p>
              <p className="text-sm text-gray-500">Khoảng giá</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl">🏠</span></div>
            </div>
          </div>
        )}

        {!loading && viewMode === 'grid' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room, index) => {
              const status = getStatusBadge(room.status);
              return (
                <div key={room._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Phòng {room.roomNumber}</h3>
                        <span className={`inline-block mt-2 px-3 py-1.5 rounded-full text-sm font-semibold ${status.color}`}>{status.icon} {status.text}</span>
                      </div>
                      <div className="flex gap-1">{[1,2,3,4,5].map(star => <span key={star} className="text-yellow-400 text-sm">★</span>)}</div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4 text-gray-600 text-sm">
                      <span className="flex items-center gap-1">📐 {room.area || 20}m²</span>
                      <span className="flex items-center gap-1">🏢 Tầng {room.floor}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{room.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(room.amenities || ['WiFi', 'Quạt']).slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{amenity}</span>
                      ))}
                      {(room.amenities?.length || 0) > 3 && <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">+{room.amenities.length - 3}</span>}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{formatPrice(room.price)}</span>
                        <span className="text-gray-400 text-sm">đ/tháng</span>
                      </div>
                      {room.status === 'available' ? (
                        <Link to="/lien-he" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-indigo-500/50 transition-all transform hover:scale-105">Đặt ngay</Link>
                      ) : (
                        <button className="px-5 py-2.5 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all border-2 border-gray-300 hover:border-gray-400 shadow-md">Chi tiết</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && viewMode === 'list' && (
          <div className="space-y-4">
            {filteredRooms.map((room, index) => {
              const status = getStatusBadge(room.status);
              return (
                <div key={room._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Phòng {room.roomNumber}</h3>
                      <span className={`inline-block mt-2 px-3 py-1.5 rounded-full text-sm font-semibold ${status.color}`}>{status.text}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-indigo-600">{formatPrice(room.price)}</span>
                      <span className="text-gray-400 text-lg">đ/tháng</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{room.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">📐 {room.area || 20}m²</span>
                    <span className="flex items-center gap-1">🏢 Tầng {room.floor}</span>
                    {(room.amenities || []).map((a, i) => <span key={i} className="flex items-center gap-1">✓ {a}</span>)}
                  </div>
                  
                  <div className="flex gap-3">
                    {room.status === 'available' && <Link to="/lien-he" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-indigo-500/50 transition-all transform hover:scale-105">Đặt phòng ngay</Link>}
                    <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-indigo-600 hover:text-indigo-700 transition-all hover:bg-gray-50 shadow-md">Xem chi tiết</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredRooms.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-6xl">🏚️</span></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy phòng</h3>
            <p className="text-gray-500 mb-6">Vui lòng thử lại với bộ lọc khác</p>
            <button onClick={() => { setFilter('all'); setPriceRange('all'); }} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all">Xóa bộ lọc</button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-12 text-center">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <span className="text-6xl mb-6 block">🤝</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Không tìm thấy phòng phù hợp?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">Liên hệ ngay với chúng tôi để được tư vấn miễn phí và tìm phòng theo yêu cầu của bạn</p>
            <Link to="/lien-he" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              Liên hệ tư vấn ngay
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
