import { Link, useLocation } from 'react-router-dom';

export default function UserLayout({ user, onLogout, children }) {
  const location = useLocation();

  const menuItems = [
    { path: '/user', label: 'Dashboard', icon: '📊' },
    { path: '/user/profile', label: 'Thông tin cá nhân', icon: '👤' },
    { path: '/user/phong', label: 'Phòng của tôi', icon: '🏠' },
    { path: '/user/hop-dong', label: 'Hợp đồng', icon: '📄' },
    { path: '/user/hoa-don', label: 'Hóa đơn', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Nhà Trọ ABC - Người Dùng</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Xin chào, <strong>{user?.name}</strong></span>
            <Link
              to="/"
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span>🏠</span>
              <span>Trang chủ</span>
            </Link>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
