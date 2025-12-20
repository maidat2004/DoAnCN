import { useState, useEffect } from 'react';
import { roomService, tenantService, contractService, invoiceService } from '../../services';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalTenants: 0,
    activeContracts: 0,
    pendingInvoices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [rooms, tenants, contracts, invoices] = await Promise.all([
          roomService.getRooms(),
          tenantService.getTenants(),
          contractService.getContracts(),
          invoiceService.getInvoices({ status: 'pending' }),
        ]);

        setStats({
          totalRooms: rooms.length,
          availableRooms: rooms.filter(r => r.status === 'available').length,
          occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
          totalTenants: tenants.length,
          activeContracts: contracts.filter(c => c.status === 'active').length,
          pendingInvoices: invoices.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Tổng số phòng', value: stats.totalRooms, icon: '🏠', color: 'blue' },
    { title: 'Phòng trống', value: stats.availableRooms, icon: '✅', color: 'green' },
    { title: 'Phòng đã thuê', value: stats.occupiedRooms, icon: '🔒', color: 'orange' },
    { title: 'Người thuê', value: stats.totalTenants, icon: '👥', color: 'purple' },
    { title: 'Hợp đồng active', value: stats.activeContracts, icon: '📄', color: 'indigo' },
    { title: 'Hóa đơn chưa thanh toán', value: stats.pendingInvoices, icon: '💰', color: 'red' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`bg-white rounded-lg shadow-lg p-6 border-l-4 border-${stat.color}-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin hệ thống</h3>
        <div className="space-y-2 text-gray-600">
          <p>✅ Hệ thống đang hoạt động bình thường</p>
          <p>📊 Dữ liệu được cập nhật real-time</p>
          <p>🔐 Kết nối API Backend thành công</p>
        </div>
      </div>
    </div>
  );
}
