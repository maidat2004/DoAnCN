import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    { icon: '📍', title: 'Địa chỉ', content: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh' },
    { icon: '📞', title: 'Điện thoại', content: '0123 456 789' },
    { icon: '✉️', title: 'Email', content: 'contact@nhatroxanh.com' },
    { icon: '⏰', title: 'Giờ làm việc', content: '8:00 - 20:00 (Thứ 2 - Chủ nhật)' },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Bạn có câu hỏi hoặc cần tư vấn? Hãy liên hệ ngay với chúng tôi!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Gửi Tin Nhắn</h2>
            
            {submitted ? (
              <div className="bg-green-100 text-green-800 p-6 rounded-xl text-center">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Gửi thành công!</h3>
                <p>Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-800 font-bold mb-2">Họ và tên *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-800 font-bold mb-2">Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-800 font-bold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="block text-gray-800 font-bold mb-2">Chủ đề</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="rent">Thuê phòng</option>
                    <option value="price">Hỏi giá</option>
                    <option value="visit">Đặt lịch xem phòng</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-800 font-bold mb-2">Nội dung *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                    placeholder="Nhập nội dung tin nhắn..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Gửi tin nhắn
                </button>
              </form>
            )}
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-xl shadow-xl p-6 flex items-start gap-4 hover:shadow-2xl transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{info.title}</h3>
                    <p className="text-gray-700 text-sm">{info.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 h-64 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-indigo-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-600">Bản đồ vị trí</p>
                  <p className="text-sm text-gray-500">123 Đường ABC, Quận XYZ</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-800 mb-2">Hướng Dẫn Đường Đi</h3>
                <p className="text-gray-600 text-sm">
                  Từ trung tâm thành phố, đi theo đường ABC khoảng 2km, rẽ trái vào 
                  đường XYZ, nhà trọ nằm bên tay phải, đối diện công viên.
                </p>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center shadow-xl">
              <h3 className="text-2xl font-extrabold mb-2">Cần tư vấn ngay?</h3>
              <p className="text-white/90 mb-6 font-medium">Gọi hotline để được hỗ trợ nhanh nhất</p>
              <a 
                href="tel:0123456789"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-3 rounded-full font-extrabold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0123 456 789
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
