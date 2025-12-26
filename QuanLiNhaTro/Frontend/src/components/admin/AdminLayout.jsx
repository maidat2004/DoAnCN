import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileText, 
  Receipt, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Crown,
  Bell,
  User,
  ChevronDown
} from 'lucide-react';

export default function AdminLayout({ user, onLogout, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const navigation = [
    { name: 'Quản lý Phòng', href: '/admin/phong', icon: Building2, gradient: 'from-purple-500 to-purple-600', emoji: '🏠' },
    { name: 'Người Thuê', href: '/admin/nguoi-thue', icon: Users, gradient: 'from-green-500 to-green-600', emoji: '👥' },
    { name: 'Tài Khoản', href: '/admin/tai-khoan', icon: Users, gradient: 'from-teal-500 to-teal-600', emoji: '👤' },
    { name: 'Hợp Đồng', href: '/admin/hop-dong', icon: FileText, gradient: 'from-orange-500 to-orange-600', emoji: '📄' },
    { name: 'Hoá Đơn', href: '/admin/hoa-don', icon: Receipt, gradient: 'from-pink-500 to-pink-600', emoji: '💰' },
    { name: 'Yêu Cầu', href: '/admin/yeu-cau', icon: Bell, gradient: 'from-orange-500 to-red-600', emoji: '📋' },
    { name: 'Dịch Vụ', href: '/admin/dich-vu', icon: Settings, gradient: 'from-indigo-500 to-indigo-600', emoji: '⚙️' },
  ];

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out lg:translate-x-0 shadow-lg
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full relative">
          
          {/* Logo */}
          <div className="relative flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {/* Beautiful Logo */}
              <div className="relative">
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md transform hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-gray-900 text-lg tracking-tight font-semibold">Quản lí nhà trọ</h2>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <button
              className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${active
                      ? 'bg-gray-50 text-gray-900 shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${item.gradient} rounded-r-full`} />
                  )}
                  
                  {/* Icon with gradient background */}
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                    ${active 
                      ? `bg-gradient-to-br ${item.gradient} shadow-md` 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                    }
                  `}>
                    <span className="text-xl">{item.emoji}</span>
                  </div>
                  
                  <span className="flex-1 font-medium">{item.name}</span>
                  
                  <ChevronRight className={`
                    w-4 h-4 transition-all duration-200
                    ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}
                  `} />
                </Link>
              );
            })}
          </nav>

          {/* User info with Dropdown */}
          <div className="relative p-4 border-t border-gray-200 bg-gray-50" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-gray-200 shadow-sm"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-lg font-bold">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm text-gray-900 truncate font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setSidebarOpen(false);
                    navigate('/admin/settings');
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
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200 flex items-center px-4 lg:px-8 shadow-sm">
          <button
            className="lg:hidden mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-3 flex-1">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              ${navigation.find(item => isActive(item.href)) 
                ? `bg-gradient-to-br ${navigation.find(item => isActive(item.href))?.gradient}` 
                : 'bg-gray-100'
              }
            `}>
              <span className="text-xl">
                {navigation.find(item => isActive(item.href))?.emoji || '📊'}
              </span>
            </div>
            <h2 className="text-xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {navigation.find(item => isActive(item.href))?.name || 'Bảng điều khiển'}
            </h2>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-700">Online</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}