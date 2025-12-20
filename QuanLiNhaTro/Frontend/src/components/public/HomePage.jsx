import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
        {/* Removed animated background */}
        <div className="absolute inset-0 bg-black/5"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-5 py-2 bg-white rounded-full text-blue-700 text-sm font-extrabold mb-6 shadow-lg">
              <span className="mr-2">🏆</span>
              Được tin tưởng bởi hơn 1000+ khách hàng
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Tìm Nhà Trọ Ưng Ý<br />
              <span className="text-yellow-300">Chỉ Trong 5 Phút</span>
            </h1>
            
            <p className="text-lg sm:text-xl mb-4 text-blue-100 font-medium italic">
              "Không gian sống hiện đại - Giá cả phải chăng - An ninh tuyệt đối"
            </p>
            
            <p className="text-base text-blue-50 mb-8 max-w-2xl mx-auto">
              Hơn 100+ phòng trọ chất lượng cao, đầy đủ tiện nghi tại vị trí trung tâm
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/phong-trong"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 rounded-xl text-lg font-extrabold hover:bg-blue-50 transition-all shadow-2xl hover:shadow-blue-500/30 transform hover:-translate-y-1"
              >
                <span className="mr-2">🔍</span>
                Xem phòng trống ngay
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/lien-he"
                className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-white text-blue-700 rounded-xl text-lg font-extrabold hover:bg-gray-100 transition-all shadow-xl"
              >
                <span className="mr-2">✨</span>
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-50"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">100+</div>
              <div className="text-gray-600 font-medium">Phòng trọ</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Khách hàng</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-shadow">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">5⭐</div>
              <div className="text-gray-600 font-medium">Đánh giá</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Hỗ trợ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-lg text-gray-600">Những lý do bạn nên tin tưởng lựa chọn</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🏠', title: 'Phòng Đầy Đủ Tiện Nghi', desc: 'Điều hòa, nóng lạnh, WiFi, nội thất đầy đủ', color: 'blue' },
              { icon: '💰', title: 'Giá Cả Hợp Lý', desc: 'Mức giá từ 2 triệu/tháng, thanh toán linh hoạt', color: 'green' },
              { icon: '🔒', title: 'An Ninh Tuyệt Đối', desc: 'Camera 24/7, bảo vệ, khóa vân tay hiện đại', color: 'purple' },
              { icon: '📍', title: 'Vị Trí Thuận Lợi', desc: 'Gần trường học, bệnh viện, siêu thị', color: 'yellow' },
              { icon: '🛠️', title: 'Hỗ Trợ Bảo Trì', desc: 'Đội ngũ kỹ thuật sẵn sàng hỗ trợ nhanh chóng', color: 'red' },
              { icon: '📋', title: 'Hợp Đồng Minh Bạch', desc: 'Thủ tục đơn giản, rõ ràng, không phí ẩn', color: 'indigo' },
            ].map((feature, index) => (
              <div key={index} className="group bg-gray-50 p-6 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Sẵn Sàng Tìm Ngôi Nhà Mơ Ước?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Hãy để chúng tôi giúp bạn tìm không gian sống lý tưởng ngay hôm nay
          </p>
          <Link 
            to="/phong-trong" 
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-blue-500/30 transform hover:-translate-y-1"
          >
            Khám Phá Ngay
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
