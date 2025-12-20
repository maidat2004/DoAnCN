import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AmenitiesPage() {
  const [activeTab, setActiveTab] = useState('all');

  const amenities = [
    { icon: '📶', title: 'WiFi Tốc Độ Cao', description: 'Internet cáp quang tốc độ 100Mbps, miễn phí 24/7', category: 'tech', color: 'from-blue-500 to-indigo-600' },
    { icon: '🔒', title: 'An Ninh 24/7', description: 'Camera AI, bảo vệ trực, khóa vân tay thông minh', category: 'security', color: 'from-green-500 to-emerald-600' },
    { icon: '⚡', title: 'Điện Ổn Định', description: 'Máy phát điện dự phòng, không lo mất điện', category: 'tech', color: 'from-yellow-500 to-amber-600' },
    { icon: '🔧', title: 'Sửa Chữa Nhanh', description: 'Đội ngũ kỹ thuật sẵn sàng xử lý 24/7', category: 'service', color: 'from-slate-500 to-gray-600' },
  ];

  const tabs = [
    { id: 'all', label: 'Tất cả', icon: '🏠' },
    { id: 'comfort', label: 'Tiện nghi', icon: '✨' },
    { id: 'facility', label: 'Cơ sở vật chất', icon: '🏢' },
    { id: 'security', label: 'An ninh', icon: '🛡️' },
    { id: 'tech', label: 'Công nghệ', icon: '💻' },
    { id: 'service', label: 'Dịch vụ', icon: '🎯' },
  ];

  const filteredAmenities = activeTab === 'all' 
    ? amenities 
    : amenities.filter(a => a.category === activeTab);

  const highlights = [
    { value: '100+', label: 'Phòng tiện nghi', icon: '🏠' },
    { value: '24/7', label: 'An ninh bảo vệ', icon: '🔒' },
    { value: '100Mbps', label: 'Internet', icon: '📶' },
    { value: '15+', label: 'Tiện ích đa dạng', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-white text-sm font-bold mb-6 shadow-lg border border-white/40">
            ✨ Tiện ích đẳng cấp 5 sao
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Tiện Ích & Dịch Vụ<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200"></span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Trải nghiệm cuộc sống hiện đại với đầy đủ tiện nghi cao cấp và dịch vụ chuyên nghiệp
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {highlights.map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-white">
                <span className="text-3xl block mb-2">{item.icon}</span>
                <span className="text-3xl font-bold block">{item.value}</span>
                <span className="text-white/80 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-50"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-md ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/50 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-teal-500'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Amenities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {filteredAmenities.map((amenity, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${amenity.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`}></div>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${amenity.color} flex items-center justify-center mb-5 text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                {amenity.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">{amenity.title}</h3>
              <p className="text-gray-600">{amenity.description}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Tại Sao Chọn Chúng Tôi?</h2>
              <p className="text-white/80 max-w-2xl mx-auto">Cam kết mang đến trải nghiệm sống tốt nhất cho cư dân</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '🏆', title: 'Chất Lượng Hàng Đầu', desc: 'Nội thất cao cấp, bảo trì định kỳ, luôn như mới' },
                { icon: '💰', title: 'Giá Cả Hợp Lý', desc: 'Chi phí minh bạch, không phí ẩn, nhiều ưu đãi' },
                { icon: '🤝', title: 'Hỗ Trợ Tận Tình', desc: 'Đội ngũ chuyên nghiệp, hỗ trợ 24/7' },
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all">
                  <span className="text-5xl block mb-4">{item.icon}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/80">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              🎁 Dịch vụ gia tăng
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Dịch Vụ Bổ Sung</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Thêm nhiều tiện ích để cuộc sống của bạn trọn vẹn hơn</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Dịch Vụ Tiện Lợi</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Giao nhận đồ tận phòng', 'Sửa chữa nhanh chóng', 'Đặt hàng online', 'Ship đồ ăn 24/7', 'Đặt xe công nghệ', 'Vệ sinh phòng'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Hỗ Trợ Khách Hàng</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Hotline 24/7', 'Hỗ trợ kỹ thuật', 'Tư vấn miễn phí', 'Phản hồi trong 30p', 'App quản lý', 'Cộng đồng cư dân'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <span className="text-6xl mb-6 block">🏠</span>
            <h2 className="text-4xl font-bold text-white mb-4">Trải Nghiệm Ngay Hôm Nay!</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Đăng ký tham quan phòng mẫu miễn phí và khám phá tất cả tiện ích cao cấp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/phong-trong" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-700 rounded-full font-extrabold text-lg hover:shadow-2xl hover:scale-105 transition-all shadow-xl">
              Xem phòng trống
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/lien-he" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white rounded-full font-bold text-lg hover:bg-white/30 transition-all backdrop-blur-sm shadow-xl border-2 border-white/40">
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
