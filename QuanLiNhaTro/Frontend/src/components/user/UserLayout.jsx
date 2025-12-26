import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, ChevronRight } from 'lucide-react';

export default function UserLayout({ user, onLogout, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const menuItems = [
    { path: '/user/profile', label: 'Thông tin cá nhân', icon: '👤', gradient: 'from-blue-500 to-blue-600' },
    { path: '/user/phong', label: 'Phòng của tôi', icon: '🏠', gradient: 'from-purple-500 to-purple-600' },
    { path: '/user/hop-dong', label: 'Hợp đồng', icon: '📄', gradient: 'from-orange-500 to-orange-600' },
    { path: '/user/hoa-don', label: 'Hóa đơn', icon: '💰', gradient: 'from-pink-500 to-pink-600' },
    { path: '/user/yeu-cau', label: 'Yêu cầu hỗ trợ', icon: '📝', gradient: 'from-green-500 to-green-600' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Nhà Trọ ABC - Người Dùng</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors border-white border-[5px]"
            >
              <span>🏠</span>
              <span>Xem bài viết</span>
            </Link>
            
            {/* User Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium">Xin chào, {user?.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Đăng nhập với</p>
                    <p className="font-semibold text-gray-900">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/user/profile');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Cập nhật thông tin</span>
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-gray-50 text-gray-900 shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${item.gradient} rounded-r-full`} />
                  )}
                  
                  {/* Icon with gradient background */}
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                    ${isActive 
                      ? `bg-gradient-to-br ${item.gradient} shadow-md` 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                    }
                  `}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  
                  <span className="flex-1 font-medium">{item.label}</span>
                  
                  <ChevronRight className={`
                    w-4 h-4 transition-all duration-200
                    ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}
                  `} />
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
