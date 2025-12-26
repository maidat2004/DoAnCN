import { useState } from 'react';

export default function ArticlePage() {
  const [articles] = useState([
    {
      id: 1,
      title: 'Mẹo Chọn Phòng Trọ Lý Tưởng Cho Sinh Viên',
      excerpt: 'Hướng dẫn chi tiết để chọn phòng trọ phù hợp với nhu cầu và ngân sách của sinh viên. Những điều cần lưu ý khi thuê phòng lần đầu.',
      content: 'Khi bước vào đời sống sinh viên, việc tìm kiếm một phòng trọ phù hợp là một trong những ưu tiên hàng đầu...',
      date: '22/12/2025',
      author: 'Quản trị viên',
      category: 'Hướng dẫn',
      image: '🏠',
      views: 1250,
      readTime: '5 phút đọc'
    },
    {
      id: 2,
      title: 'Cách Tiết Kiệm Chi Phí Sinh Hoạt Khi Ở Trọ',
      excerpt: 'Những bí quyết giúp bạn tiết kiệm tiền điện, nước và các chi phí sinh hoạt hàng tháng khi sống ở phòng trọ một cách hiệu quả.',
      content: 'Tiết kiệm chi phí là kỹ năng quan trọng khi sống xa nhà. Dưới đây là những mẹo hay ho giúp bạn...',
      date: '20/12/2025',
      author: 'Quản trị viên',
      category: 'Mẹo hay',
      image: '💰',
      views: 980,
      readTime: '4 phút đọc'
    },
    {
      id: 3,
      title: 'An Toàn Khi Thuê Phòng Trọ - Những Điều Cần Biết',
      excerpt: 'Những lưu ý quan trọng về an toàn, pháp lý và các quyền lợi của người thuê trọ để bảo vệ bản thân một cách tốt nhất.',
      content: 'An toàn là ưu tiên hàng đầu khi thuê phòng trọ. Bạn cần chú ý những điểm sau...',
      date: '18/12/2025',
      author: 'Quản trị viên',
      category: 'An toàn',
      image: '🔒',
      views: 1560,
      readTime: '6 phút đọc'
    },
    {
      id: 4,
      title: 'Quy Trình Thanh Toán Hóa Đơn Điện Nước Hàng Tháng',
      excerpt: 'Hướng dẫn chi tiết về cách tính và thanh toán các hóa đơn điện nước, internet và các dịch vụ khác trong phòng trọ.',
      content: 'Việc hiểu rõ cách tính và thanh toán hóa đơn giúp bạn quản lý tài chính tốt hơn...',
      date: '15/12/2025',
      author: 'Quản trị viên',
      category: 'Tài chính',
      image: '📊',
      views: 850,
      readTime: '5 phút đọc'
    },
    {
      id: 5,
      title: 'Trang Trí Phòng Trọ Đẹp Với Chi Phí Tiết Kiệm',
      excerpt: 'Những ý tưởng sáng tạo để biến phòng trọ của bạn trở nên ấm cúng và đẹp mắt mà không tốn quá nhiều tiền.',
      content: 'Phòng trọ cũng có thể trở thành không gian sống đẹp nếu bạn biết cách trang trí...',
      date: '12/12/2025',
      author: 'Quản trị viên',
      category: 'Trang trí',
      image: '🎨',
      views: 1100,
      readTime: '7 phút đọc'
    },
    {
      id: 6,
      title: 'Quyền Và Trách Nhiệm Của Người Thuê Trọ',
      excerpt: 'Tìm hiểu về các quyền lợi và nghĩa vụ của người thuê trọ theo quy định pháp luật Việt Nam.',
      content: 'Hiểu rõ quyền và trách nhiệm của mình giúp bạn tránh được nhiều rắc rối không đáng có...',
      date: '10/12/2025',
      author: 'Quản trị viên',
      category: 'Pháp lý',
      image: '⚖️',
      views: 720,
      readTime: '8 phút đọc'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Tất cả', 'Hướng dẫn', 'Mẹo hay', 'An toàn', 'Tài chính', 'Trang trí', 'Pháp lý'];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'Tất cả' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              📚 Bài Viết & Tin Tức
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              Cập nhật thông tin, mẹo vặt và kinh nghiệm hữu ích về thuê phòng trọ
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-14 rounded-2xl text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-2xl"
                />
                <svg
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl text-gray-600 font-semibold">Không tìm thấy bài viết nào</p>
            <p className="text-gray-500 mt-2">Thử thay đổi từ khóa hoặc chọn danh mục khác</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Article Header with Icon */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-center">
                  <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform">
                    {article.image}
                  </div>
                  <span className="inline-block px-4 py-1 bg-white/90 text-blue-600 rounded-full text-sm font-bold">
                    {article.category}
                  </span>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{article.date}</span>
                    </div>
                  </div>

                  {/* Article Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{article.views} lượt xem</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <button className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                    Đọc thêm →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Bạn đã có tài khoản?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Đăng nhập để quản lý phòng trọ và xem thông tin cá nhân
          </p>
          <a
            href="/login"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Đăng nhập ngay →
          </a>
        </div>
      </div>
    </div>
  );
}
