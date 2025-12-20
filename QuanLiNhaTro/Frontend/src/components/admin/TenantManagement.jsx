import { useEffect, useState } from 'react';
import { tenantService, roomService, userService } from '../../services';

export default function TenantManagement() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idCard: '',
    userId: '',
    roomId: '',
    status: 'pending',
  });

  const loadTenants = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, roomList, userList] = await Promise.all([
        tenantService.getTenants(),
        roomService.getRooms(),
        userService.getUsers({ role: 'user' }), // Chỉ lấy users thường (không phải admin)
      ]);
      setTenants(data);
      setRooms(roomList);
      setUsers(userList);
    } catch (err) {
      setError(err.message || 'Không tải được danh sách người thuê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      idCard: '',
      userId: '',
      roomId: '',
      status: 'pending',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await tenantService.updateTenant(editing._id, {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          idCard: formData.idCard,
          room: formData.roomId || null,
          status: formData.status,
        });
      } else {
        // create requires userId, optional roomId
        await tenantService.createTenant({
          userId: formData.userId,
          roomId: formData.roomId || null,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          idCard: formData.idCard,
          status: formData.status,
        });
      }
      setShowForm(false);
      resetForm();
      await loadTenants();
    } catch (err) {
      alert(err.message || 'Lưu người thuê thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa người thuê này?')) return;
    try {
      setDeletingId(id);
      await tenantService.deleteTenant(id);
      await loadTenants();
    } catch (err) {
      alert(err.message || 'Xóa thất bại');
    } finally {
      setDeletingId('');
    }
  };

  const startEdit = (t) => {
    setEditing(t);
    setFormData({
      fullName: t.fullName || '',
      email: t.email || t.user?.email || '',
      phone: t.phone || t.user?.phone || '',
      idCard: t.idCard || '',
      userId: t.user?._id || '',
      roomId: t.room?._id || '',
      status: t.status || 'pending',
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Quản lý Người thuê</h2>
          <p className="text-gray-500 mt-1">Danh sách lấy trực tiếp từ database (tenantService)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
          >
            {showForm ? 'Đóng' : '+ Thêm người thuê'}
          </button>
          <button
            onClick={loadTenants}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Làm mới
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">{editing ? 'Cập nhật người thuê' : 'Thêm người thuê mới'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Họ tên</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SĐT</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CMND/CCCD</label>
              <input
                type="text"
                value={formData.idCard}
                onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            {!editing && (
              <div>
                <label className="block text-sm font-medium mb-2">Chọn người dùng</label>
                <select
                  value={formData.userId}
                  onChange={(e) => {
                    const selectedUser = users.find(u => u._id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      userId: e.target.value,
                      fullName: selectedUser?.name || formData.fullName,
                      email: selectedUser?.email || formData.email,
                      phone: selectedUser?.phone || formData.phone,
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">-- Chọn user --</option>
                  {users.filter(u => !tenants.find(t => t.user?._id === u._id)).map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} - {user.email}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Chọn user đã đăng ký để tạo hồ sơ người thuê</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Phòng</label>
              <select
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Chưa gán phòng</option>
                {rooms.map((r) => (
                  <option key={r._id} value={r._id}>Phòng {r.roomNumber}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="pending">Chờ duyệt</option>
                <option value="active">Đang thuê</option>
                <option value="inactive">Ngưng</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-16">Đang tải...</div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => { resetForm(); setShowForm(true); }}
            className="w-full mb-4 text-left border-2 border-dashed border-blue-300 rounded-xl bg-white p-4 flex items-center justify-between hover:border-blue-500 hover:bg-blue-50 transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">+</div>
              <div>
                <div className="text-lg font-semibold text-blue-700">Thêm người thuê mới</div>
                <div className="text-sm text-gray-500">Nhấn để mở form tạo/ghi nhanh</div>
              </div>
            </div>
            <span className="text-sm text-blue-600 font-semibold">Mở form</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Họ tên</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">SĐT</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Phòng</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tenants.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{t.fullName}</div>
                      <div className="text-xs text-gray-500">ID: {t._id}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.email || t.user?.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.phone || t.user?.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {t.room?.roomNumber ? `Phòng ${t.room.roomNumber}` : 'Chưa gán'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : t.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {t.status === 'active' ? 'Đang thuê' : t.status === 'pending' ? 'Chờ duyệt' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm space-x-2">
                      <button
                        onClick={() => startEdit(t)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        disabled={deletingId === t._id}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                      >
                        {deletingId === t._id ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tenants.length === 0 && (
            <div className="p-6 text-center text-gray-500">Chưa có người thuê</div>
          )}
          </div>
        </>
      )}

      {/* Floating quick add button */}
      <button
        type="button"
        onClick={() => { resetForm(); setShowForm(true); }}
        className="fixed bottom-6 right-6 px-4 py-3 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 focus:outline-none"
      >
        + Thêm người thuê
      </button>
    </div>
  );
}
