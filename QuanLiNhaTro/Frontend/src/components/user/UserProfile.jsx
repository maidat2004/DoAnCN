import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { tenantService } from '../../services';

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tenantInfo, setTenantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTenantInfo();
  }, [user]);

  const loadTenantInfo = async () => {
    if (!user?.tenantId) {
      setLoading(false);
      return;
    }

    try {
      const data = await tenantService.getTenant(user.tenantId);
      setTenantInfo(data);
    } catch (err) {
      setError('Không thể tải thông tin người thuê');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Thông tin cá nhân</h2>
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>🏠</span>
          <span>Về trang chủ</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Thông tin tài khoản */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">👤</span>
          Thông tin tài khoản
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-b pb-3">
            <label className="text-sm font-medium text-gray-500">ID Tài khoản</label>
            <p className="text-gray-800 mt-1 font-mono text-sm">{user?.id || 'N/A'}</p>
          </div>
          <div className="border-b pb-3">
            <label className="text-sm font-medium text-gray-500">Tên người dùng</label>
            <p className="text-gray-800 mt-1 font-semibold">{user?.name || 'Chưa cập nhật'}</p>
          </div>
          <div className="border-b pb-3">
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-800 mt-1">{user?.email || 'Chưa cập nhật'}</p>
          </div>
          <div className="border-b pb-3">
            <label className="text-sm font-medium text-gray-500">Vai trò</label>
            <p className="text-gray-800 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Thông tin người thuê */}
      {tenantInfo ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">📋</span>
            Thông tin người thuê
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Họ và tên đầy đủ</label>
              <p className="text-gray-800 mt-1 font-semibold">{tenantInfo.fullName}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">CMND/CCCD</label>
              <p className="text-gray-800 mt-1 font-mono">{tenantInfo.idCard}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
              <p className="text-gray-800 mt-1">{tenantInfo.phone}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-800 mt-1">{tenantInfo.email}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Ngày sinh</label>
              <p className="text-gray-800 mt-1">{formatDate(tenantInfo.dateOfBirth)}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Quê quán</label>
              <p className="text-gray-800 mt-1">{tenantInfo.hometown || 'Chưa cập nhật'}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Địa chỉ hiện tại</label>
              <p className="text-gray-800 mt-1">{tenantInfo.currentAddress || 'Chưa cập nhật'}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Nghề nghiệp</label>
              <p className="text-gray-800 mt-1">{tenantInfo.occupation}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Ngày vào ở</label>
              <p className="text-gray-800 mt-1">{formatDate(tenantInfo.moveInDate)}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Trạng thái</label>
              <p className="text-gray-800 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tenantInfo.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : tenantInfo.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {tenantInfo.status === 'active' ? 'Đang ở' : 
                   tenantInfo.status === 'pending' ? 'Chờ duyệt' : 'Không hoạt động'}
                </span>
              </p>
            </div>
          </div>

          {/* Thông tin liên hệ khẩn cấp */}
          {tenantInfo.emergencyContact && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-xl mr-2">🚨</span>
                Liên hệ khẩn cấp
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Người liên hệ</label>
                  <p className="text-gray-800 mt-1">{tenantInfo.emergencyContact.name || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                  <p className="text-gray-800 mt-1">{tenantInfo.emergencyContact.phone || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Mối quan hệ</label>
                  <p className="text-gray-800 mt-1">{tenantInfo.emergencyContact.relationship || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Ghi chú */}
          {tenantInfo.notes && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-xl mr-2">📝</span>
                Ghi chú
              </h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{tenantInfo.notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg">
          <p className="font-medium">Chưa có thông tin người thuê</p>
          <p className="text-sm mt-1">Vui lòng liên hệ quản trị viên để cập nhật thông tin.</p>
        </div>
      )}
    </div>
  );
}
