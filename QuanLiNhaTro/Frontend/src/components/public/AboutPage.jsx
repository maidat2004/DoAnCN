import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const [activeTimeline, setActiveTimeline] = useState(0);

  const stats = [
    { number: '10+', label: 'Năm kinh nghiệm', icon: '📅', color: 'from-blue-500 to-indigo-600' },
    { number: '100+', label: 'Phòng cho thuê', icon: '🏠', color: 'from-green-500 to-emerald-600' },
    { number: '1000+', label: 'Khách hàng hài lòng', icon: '😊', color: 'from-purple-500 to-pink-600' },
    { number: '98%', label: 'Tỷ lệ hài lòng', icon: '⭐', color: 'from-yellow-500 to-orange-600' },
  ];

  const team = [
    { name: 'Nguyễn Văn Minh', role: 'Giám Đốc Điều Hành', avatar: '👨‍💼', desc: '15 năm kinh nghiệm bất động sản', social: { fb: '#', linkedin: '#' } },
    { name: 'Trần Thị Hương', role: 'Quản Lý Vận Hành', avatar: '👩‍💼', desc: '10 năm quản lý nhà trọ', social: { fb: '#', linkedin: '#' } },
    { name: 'Lê Văn Thành', role: 'Trưởng Bộ Phận Kỹ Thuật', avatar: '👨‍🔧', desc: 'Chuyên gia bảo trì & sửa chữa', social: { fb: '#', linkedin: '#' } },
    { name: 'Phạm Thị Mai', role: 'Chăm Sóc Khách Hàng', avatar: '👩‍💻', desc: 'Luôn lắng nghe & hỗ trợ', social: { fb: '#', linkedin: '#' } },
  ];

  const timeline = [
    { year: '2015', title: 'Khởi đầu', desc: 'Thành lập với 10 phòng trọ đầu tiên tại Quận 1' },
    { year: '2017', title: 'Mở rộng', desc: 'Tăng lên 30 phòng, mở thêm chi nhánh Quận 3' },
    { year: '2019', title: 'Đổi mới', desc: 'Áp dụng công nghệ quản lý, nâng cấp tiện nghi' },
    { year: '2021', title: 'Phát triển', desc: 'Đạt 70 phòng, ra mắt ứng dụng di động' },
    { year: '2023', title: 'Hiện tại', desc: 'Hơn 100 phòng, phục vụ 1000+ khách hàng' },
  ];

  const values = [
    { icon: '🎯', title: 'Chất Lượng', desc: 'Cam kết cung cấp dịch vụ và cơ sở vật chất chất lượng cao nhất, luôn đặt tiêu chuẩn lên hàng đầu', color: 'from-blue-500 to-indigo-600' },
    { icon: '🤝', title: 'Uy Tín', desc: 'Xây dựng niềm tin qua hành động, minh bạch trong mọi giao dịch, giữ vững cam kết với khách hàng', color: 'from-green-500 to-teal-600' },
    { icon: '❤️', title: 'Tận Tâm', desc: 'Lắng nghe và thấu hiểu nhu cầu khách hàng, phục vụ với tất cả sự nhiệt huyết và chân thành', color: 'from-pink-500 to-rose-600' },
    { icon: '🚀', title: 'Đổi Mới', desc: 'Không ngừng cải tiến, áp dụng công nghệ mới, mang đến trải nghiệm sống hiện đại cho cư dân', color: 'from-purple-500 to-indigo-600' },
  ];

  const testimonials = [
    { name: 'Nguyễn Thành Long', role: 'Người thuê trọ', content: 'Phòng trọ sạch sẽ, tiện nghi đầy đủ, chủ nhà rất thân thiện. Mình ở đây 2 năm rồi rất hài lòng!', avatar: '👨‍🎓', rating: 5 },
    { name: 'Trần Thị Hạnh', role: 'Nhân viên văn phòng', content: 'Giá cả hợp lý, an ninh tốt, wifi mạnh. Điều mình thích nhất là đội ngũ hỗ trợ rất nhiệt tình.', avatar: '👩‍💼', rating: 5 },
    { name: 'Lê Minh Tuấn', role: 'Freelancer', content: 'Không gian yên tĩnh, phù hợp để làm việc tại nhà. Các tiện ích như gym, bếp chung rất tiện lợi.', avatar: '👨‍💻', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full  "></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/20 rounded-full   animation-delay-2000"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Nhà Trọ Xanh <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200"></span>
            </h1>
            <p className="text-2xl text-white/90 mb-4 font-medium">Nơi bạn tìm thấy ngôi nhà thứ hai của mình</p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Với hơn 10 năm kinh nghiệm, chúng tôi tự hào là đơn vị cho thuê phòng trọ uy tín hàng đầu, 
              mang đến không gian sống chất lượng với giá cả phải chăng.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-50"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-20 mb-20 relative z-20">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-3xl`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              📖 Câu chuyện của chúng tôi
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Hành Trình 10 Năm Xây Dựng Niềm Tin</h2>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                <span className="font-bold text-indigo-600">Nhà Trọ Xanh</span> được thành lập vào năm 2015 
                bởi một nhóm bạn trẻ với ước mơ mang đến những không gian sống chất lượng với giá cả 
                phải chăng cho người thuê tại thành phố.
              </p>
              <p>
                Qua hơn <span className="font-bold">10 năm</span> phát triển không ngừng, chúng tôi đã xây dựng được hệ thống 
                hơn <span className="font-bold">100 phòng trọ</span> với đầy đủ tiện nghi hiện đại, phục vụ 
                hơn <span className="font-bold">1000+ khách hàng</span> và luôn nhận được những phản hồi tích cực.
              </p>
              <p>
                Chúng tôi tin rằng <span className="italic">"mỗi người đều xứng đáng có một nơi ở thoải mái, 
                an toàn và tiện nghi"</span>. Đó là lý do tại sao chúng tôi không ngừng nỗ lực cải thiện 
                chất lượng dịch vụ mỗi ngày.
              </p>
            </div>
            <div className="flex gap-4 mt-8">
              <Link to="/phong-trong" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-blue-500/50 transition-all transform hover:scale-105">
                Xem phòng trống
              </Link>
              <Link to="/lien-he" className="px-6 py-3 border-2 border-indigo-600 text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg">
                Liên hệ ngay
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl h-96 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="text-8xl block mb-4">🏠</span>
                  <p className="text-2xl font-bold">Nhà Trọ Xanh</p>
                  <p className="text-white/80">Nơi an cư lý tưởng</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
                <div>
                  <div className="text-3xl font-bold text-gray-800">98%</div>
                  <div className="text-gray-500">Khách hàng hài lòng</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              📈 Lịch sử phát triển
            </span>
            <h2 className="text-4xl font-bold text-gray-800">Hành Trình Phát Triển</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {timeline.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTimeline(index)}
                  className={`px-6 py-3 rounded-xl font-extrabold transition-all shadow-md ${
                    activeTimeline === index
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/50 scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-indigo-500'
                  }`}
                >
                  {item.year}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <span className="text-6xl mb-4 block">{['🌱', '📈', '💡', '🚀', '🏆'][activeTimeline]}</span>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{timeline[activeTimeline].year} - {timeline[activeTimeline].title}</h3>
              <p className="text-xl text-gray-600">{timeline[activeTimeline].desc}</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              💎 Giá trị cốt lõi
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Giá Trị Cốt Lõi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Những nguyên tắc định hướng mọi hoạt động của chúng tôi</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${value.color}`}></div>
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              👥 Đội ngũ
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Đội Ngũ Của Chúng Tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Những con người tận tâm, chuyên nghiệp, luôn sẵn sàng phục vụ bạn</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 text-center">
                  <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform">
                    {member.avatar}
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm mb-4">{member.desc}</p>
                  <div className="flex justify-center gap-3">
                    <a href={member.social.fb} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">f</a>
                    <a href={member.social.linkedin} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">in</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4">
              💬 Đánh giá
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Khách Hàng Nói Gì?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <span key={i} className="text-yellow-400 text-xl">★</span>)}
                </div>
                <p className="text-gray-600 mb-6 italic">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{t.name}</h4>
                    <p className="text-gray-500 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full "></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full "></div>
          <div className="relative z-10">
            <span className="text-6xl mb-6 block">🏠</span>
            <h2 className="text-4xl font-bold text-white mb-4">Sẵn sàng tìm ngôi nhà mới?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Hãy để chúng tôi giúp bạn tìm không gian sống lý tưởng với giá cả phải chăng
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/phong-trong" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-full font-extrabold text-lg hover:shadow-2xl hover:scale-105 transition-all shadow-xl">
                Khám phá phòng trống
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link to="/lien-he" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-white rounded-full font-bold text-lg hover:bg-white transition-all  shadow-xl border-2 border-white/40">
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
