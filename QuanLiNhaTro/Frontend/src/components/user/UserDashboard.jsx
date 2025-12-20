import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { tenantService, roomService, contractService, invoiceService } from '../../services';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    tenant: null,
    room: null,
    unpaidInvoices: 0,
    activeContract: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.tenantId) {
      setLoading(false);
      return;
    }

    try {
      const tenantData = await tenantService.getTenant(user.tenantId);
      setStats(prev => ({ ...prev, tenant: tenantData }));

      if (tenantData.room) {
        const roomData = await roomService.getRoom(tenantData.room);
        setStats(prev => ({ ...prev, room: roomData }));
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { icon: '👤', label: 'Thông tin cá nhân', path: '/user/profile', color: 'bg-blue-500' },
    { icon: '🏠', label: 'Phòng của tôi', path: '/user/phong', color: 'bg-green-500' },
    { icon: '📄', label: 'Hợp đồng', path: '/user/hop-dong', color: 'bg-purple-500' },
    { icon: '💰', label: 'Hóa đơn', path: '/user/hoa-don', color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Xin chào, {user?.name}! 👋
      </h2>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-6 text-white">
        <h3 className="text-2xl font-bold mb-2">Chào mừng bạn đến với hệ thống quản lý nhà trọ</h3>
        <p className="text-blue-100">Quản lý thông tin cá nhân, phòng trọ, hợp đồng và hóa đơn một cách dễ dàng</p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">👤</span>
            <span className="text-sm font-medium text-gray-500">Tài khoản</span>
          </div>
          <h4 className="text-lg font-bold text-gray-800">{user?.name}</h4>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>

        {/* Room Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🏠</span>
            <span className="text-sm font-medium text-gray-500">Phòng</span>
          </div>
          {stats.room ? (
            <>
              <h4 className="text-lg font-bold text-gray-800">{stats.room.roomNumber}</h4>
              <p className="text-sm text-gray-600">{stats.room.roomType}</p>
            </>
          ) : (
            <p className="text-sm text-gray-500">Chưa có phòng</p>
          )}
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📊</span>
            <span className="text-sm font-medium text-gray-500">Trạng thái</span>
          </div>
          {stats.tenant ? (
            <>
              <h4 className="text-lg font-bold text-gray-800">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  stats.tenant.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : stats.tenant.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {stats.tenant.status === 'active' ? 'Đang ở' : 
                   stats.tenant.status === 'pending' ? 'Chờ duyệt' : 'Không hoạt động'}
                </span>
              </h4>
            </>
          ) : (
            <p className="text-sm text-gray-500">Chưa cập nhật</p>
          )}
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">💰</span>
            <span className="text-sm font-medium text-gray-500">Hóa đơn</span>
          </div>
          <h4 className="text-lg font-bold text-gray-800">{stats.unpaidInvoices}</h4>
          <p className="text-sm text-gray-600">Chưa thanh toán</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Truy cập nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${link.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-center`}
            >
              <div className="text-3xl mb-2">{link.icon}</div>
              <div className="font-medium text-sm">{link.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tenant Details */}
      {stats.tenant && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">📋</span>
            Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Họ và tên</label>
              <p className="text-gray-800 mt-1 font-semibold">{stats.tenant.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
              <p className="text-gray-800 mt-1">{stats.tenant.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-800 mt-1">{stats.tenant.email}</p>
            </div>
          </div>
          <div className="mt-4 text-right">
            <Link
              to="/user/profile"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Xem chi tiết →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
