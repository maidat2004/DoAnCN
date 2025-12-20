import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingPlans = [
    {
      name: 'Phòng Đơn',
      subtitle: 'Tiết kiệm & Thoải mái',
      price: billingCycle === 'monthly' ? '1.200.000' : '13.200.000',
      originalPrice: billingCycle === 'yearly' ? '14.400.000' : null,
      size: '14-16m²',
      features: [
        { text: '1 người ở', included: true },
        { text: 'Giường đơn cao cấp', included: true },
        { text: 'Tủ quần áo gỗ', included: true },
        { text: 'Bàn học + ghế', included: true },
        { text: 'WiFi tốc độ cao', included: true },
        { text: 'WC riêng', included: true },
        { text: 'Điều hòa', included: false },
        { text: 'Ban công', included: false },
      ],
      popular: false,
      gradient: 'from-blue-500 to-cyan-500',
      icon: '🛏️'
    },
    {
      name: 'Phòng Đôi',
      subtitle: 'Phổ biến nhất',
      price: billingCycle === 'monthly' ? '1.500.000' : '16.500.000',
      originalPrice: billingCycle === 'yearly' ? '18.000.000' : null,
      size: '16-18m²',
      features: [
        { text: '2 người ở', included: true },
        { text: 'Giường đôi/2 giường đơn', included: true },
        { text: 'Tủ quần áo lớn', included: true },
        { text: 'Bàn làm việc', included: true },
        { text: 'WiFi tốc độ cao', included: true },
        { text: 'WC riêng', included: true },
        { text: 'Điều hòa 2 chiều', included: true },
        { text: 'Ban công riêng', included: true },
      ],
      popular: true,
      gradient: 'from-indigo-600 to-purple-600',
      icon: '👥'
    },
    {
      name: 'Phòng VIP',
      subtitle: 'Cao cấp & Đẳng cấp',
      price: billingCycle === 'monthly' ? '1.500.000' : '16.500.000',
      originalPrice: billingCycle === 'yearly' ? '18.000.000' : null,
      size: '18-20m²',
      features: [
        { text: '2-3 người ở', included: true },
        { text: 'Phòng khách riêng', included: true },
        { text: 'Bếp nhỏ đầy đủ', included: true },
        { text: 'Ban công view đẹp', included: true },
        { text: 'Nội thất cao cấp', included: true },
        { text: 'Điều hòa 2 chiều', included: true },
        { text: 'Bình nóng lạnh', included: true },
        { text: 'Máy giặt riêng', included: true },
      ],
      popular: false,
      gradient: 'from-purple-600 to-pink-600',
      icon: '👑'
    },
  ];

  const services = [
    { icon: '💡', name: 'Điện', price: '3.500đ/kWh', desc: 'Theo đồng hồ riêng', color: 'from-yellow-400 to-orange-500' },
    { icon: '💧', name: 'Nước', price: '12.000đ/khối', desc: 'Theo đồng hồ riêng', color: 'from-blue-400 to-cyan-500' },
    { icon: '📶', name: 'Internet', price: 'Miễn phí', desc: 'Cáp quang 100Mbps', color: 'from-green-400 to-emerald-500' },
    
  ];

  const faqs = [
    { q: 'Đặt cọc bao nhiêu?', a: 'Đặt cọc 1 tháng tiền phòng, hoàn lại khi trả phòng.' },
    { q: 'Có hợp đồng không?', a: 'Có, hợp đồng tối thiểu 6 tháng, gia hạn tự động.' },
    { q: 'Thanh toán như thế nào?', a: 'Chuyển khoản, tiền mặt hoặc thanh toán online.' },
    { q: 'Có giảm giá không?', a: 'Giảm 10% khi thanh toán cả năm, 5% cho người thuê dài hạn.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-5 py-2 bg-white rounded-full text-indigo-700 text-sm font-extrabold mb-6 shadow-lg">
            💰 Giá cả minh bạch - Không phí ẩn
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Bảng Giá <span className="text-yellow-300">Phòng Trọ</span>
          </h1>
          <p className="text-xl font-bold text-white max-w-2xl mx-auto mb-10 drop-shadow-md">
            Lựa chọn gói phòng phù hợp với nhu cầu và ngân sách của bạn. Cam kết không phát sinh chi phí!
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white p-2 rounded-full shadow-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-full font-extrabold transition-all ${
                billingCycle === 'monthly' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Theo tháng
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-full font-extrabold transition-all flex items-center gap-2 ${
                billingCycle === 'yearly' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Theo năm
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">-10%</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-50"></div>
      </div>

      <div className="container mx-auto px-4 py-16 -mt-8">
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 ${
                plan.popular ? 'ring-4 ring-indigo-500 ring-offset-4' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-1 -right-1 z-10">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 text-sm font-bold transform rotate-0 shadow-lg rounded-bl-2xl">
                    ⭐ Phổ biến nhất
                  </div>
                </div>
              )}
              
              <div className={`p-8 bg-gradient-to-br ${plan.gradient} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="text-5xl mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-white/80 text-sm mb-4">{plan.subtitle}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-white/80">đ/{billingCycle === 'monthly' ? 'tháng' : 'năm'}</span>
                </div>
                {plan.originalPrice && (
                  <p className="text-white/60 line-through mt-1">{plan.originalPrice}đ</p>
                )}
                <p className="text-white/80 text-sm mt-2">📐 {plan.size}</p>
              </div>

              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {feature.included ? (
                        <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : (
                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/lien-he"
                  className={`block w-full text-center py-4 rounded-xl font-extrabold text-lg transition-all shadow-lg transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/50'
                      : 'bg-white text-gray-800 hover:bg-gray-50 border-2 border-gray-300 hover:border-indigo-500'
                  }`}
                >
                  Đặt phòng ngay →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              📋 Chi phí bổ sung
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Chi Phí Dịch Vụ Khác</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Tất cả chi phí được công khai minh bạch, không phát sinh thêm</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group">
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-1">{service.name}</h4>
                <p className="text-2xl font-bold text-indigo-600 mb-2">{service.price}</p>
                <p className="text-gray-500 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto mb-20 overflow-x-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              📊 So sánh chi tiết
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Bảng So Sánh Các Gói</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left">Tiện ích</th>
                  <th className="py-4 px-6 text-center">Phòng Đơn</th>
                  <th className="py-4 px-6 text-center bg-white">Phòng Đôi</th>
                  <th className="py-4 px-6 text-center">Phòng VIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {['Diện tích', 'Số người ở', 'Điều hòa', 'Ban công', 'Bếp riêng', 'Phòng khách'].map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-700">{item}</td>
                    <td className="py-4 px-6 text-center">
                      {idx === 0 && '15-18m²'}
                      {idx === 1 && '1'}
                      {idx === 2 && <span className="text-gray-400">✗</span>}
                      {idx === 3 && <span className="text-gray-400">✗</span>}
                      {idx === 4 && <span className="text-gray-400">✗</span>}
                      {idx === 5 && <span className="text-gray-400">✗</span>}
                    </td>
                    <td className="py-4 px-6 text-center bg-indigo-50">
                      {idx === 0 && '20-25m²'}
                      {idx === 1 && '2'}
                      {idx === 2 && <span className="text-green-500">✓</span>}
                      {idx === 3 && <span className="text-green-500">✓</span>}
                      {idx === 4 && <span className="text-gray-400">✗</span>}
                      {idx === 5 && <span className="text-gray-400">✗</span>}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {idx === 0 && '30-35m²'}
                      {idx === 1 && '2-3'}
                      {idx === 2 && <span className="text-green-500">✓</span>}
                      {idx === 3 && <span className="text-green-500">✓</span>}
                      {idx === 4 && <span className="text-green-500">✓</span>}
                      {idx === 5 && <span className="text-green-500">✓</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              ❓ Thắc mắc thường gặp
            </span>
            <h2 className="text-4xl font-bold text-gray-800">Câu Hỏi Thường Gặp</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm font-bold">
                    {index + 1}
                  </span>
                  {faq.q}
                </h4>
                <p className="text-gray-600 ml-10">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full  -translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full  translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <span className="text-6xl mb-6 block">🎉</span>
            <h2 className="text-4xl font-bold text-white mb-4">Sẵn sàng thuê phòng?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Đăng ký ngay hôm nay để nhận ưu đãi giảm 5% tháng đầu tiên!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/lien-he"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-full font-extrabold text-lg hover:shadow-2xl hover:scale-105 transition-all shadow-xl"
              >
                Liên hệ ngay
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                to="/phong-trong"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-white rounded-full font-bold text-lg hover:bg-white transition-all "
              >
                Xem phòng trống
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
