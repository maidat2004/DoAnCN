import { Link, useLocation } from 'react-router-dom';

export default function AdminLayout({ user, onLogout, children }) {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/nguoi-dung', label: 'Người dùng', icon: '👤' },
    { path: '/admin/phong', label: 'Quản lý phòng', icon: '🏠' },
    { path: '/admin/nguoi-thue', label: 'Người thuê', icon: '👥' },
    { path: '/admin/hop-dong', label: 'Hợp đồng', icon: '📄' },
    { path: '/admin/hoa-don', label: 'Hóa đơn', icon: '💰' },
    { path: '/admin/dich-vu', label: 'Dịch vụ', icon: '🛠️' },
    { path: '/admin/yeu-cau', label: 'Yêu cầu', icon: '📝' },
    { path: '/admin/settings', label: 'Cài đặt', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Quản Lý Nhà Trọ - Admin</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Xin chào, <strong>{user?.name}</strong></span>
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
        {/* Sidebar */}
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
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-blue-50'
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

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
