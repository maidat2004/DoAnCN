// Ví dụ sử dụng các phương thức tự động cập nhật trong UserManagement component

import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { toast } from 'sonner';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

  useEffect(() => {
    loadUsers();

    // Cleanup khi component unmount
    return () => {
      userService.stopAutoRefresh();
    };
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.refreshData();
      setUsers(data);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoRefresh = () => {
    if (autoRefreshEnabled) {
      userService.stopAutoRefresh();
      setAutoRefreshEnabled(false);
      toast.success('⏹️ Đã tắt tự động cập nhật');
    } else {
      userService.startAutoRefresh(
        (newData) => {
          setUsers(newData);
          toast.info('🔄 Dữ liệu đã được cập nhật tự động');
        },
        {}, // filters
        15000 // 15 giây
      );
      setAutoRefreshEnabled(true);
      toast.success('🚀 Đã bật tự động cập nhật mỗi 15 giây');
    }
  };

  const handleManualRefresh = async () => {
    try {
      const data = await userService.refreshData();
      setUsers(data);
      toast.success('✅ Dữ liệu đã được cập nhật thủ công');
    } catch (error) {
      toast.error('Không thể cập nhật dữ liệu');
    }
  };

  const handleAutoReload = () => {
    userService.autoReloadPage(
      3000, // 3 giây
      'Dữ liệu quan trọng đã được cập nhật. Trang sẽ tải lại để hiển thị thông tin mới nhất.'
    );
  };

  return (
    <div className="space-y-4">
      {/* Header với các nút điều khiển */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản Lý Người Dùng</h2>
        <div className="flex gap-2">
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            🔄 Cập Nhật
          </button>

          <button
            onClick={toggleAutoRefresh}
            className={`px-4 py-2 rounded ${
              autoRefreshEnabled
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {autoRefreshEnabled ? '⏹️ Tắt Auto Refresh' : '🚀 Bật Auto Refresh'}
          </button>

          <button
            onClick={handleAutoReload}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            🔄 Reload Trang
          </button>
        </div>
      </div>

      {/* Hiển thị trạng thái */}
      {autoRefreshEnabled && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded">
          🚀 Đang tự động cập nhật dữ liệu mỗi 15 giây
        </div>
      )}

      {/* Danh sách users */}
      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="grid gap-4">
          {users.map(user => (
            <div key={user._id} className="border rounded p-4">
              <h3>{user.fullName}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}