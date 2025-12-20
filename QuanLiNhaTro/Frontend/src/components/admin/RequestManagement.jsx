import { useEffect, useState } from 'react';
import { requestService, tenantService, roomService } from '../../services';

export default function RequestManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolvingId, setResolvingId] = useState('');
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'repair',
    priority: 'medium',
    status: 'pending',
    tenant: '',
    room: '',
  });

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, tenantList, roomList] = await Promise.all([
        requestService.getRequests(),
        tenantService.getTenants(),
        roomService.getRooms(),
      ]);
      setRequests(data);
      setTenants(tenantList);
      setRooms(roomList);
    } catch (err) {
      setError(err.message || 'Không tải được yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setFormData({
      title: '',
      description: '',
      type: 'repair',
      priority: 'medium',
      status: 'pending',
      tenant: tenants[0]?._id || '',
      room: rooms[0]?._id || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await requestService.updateRequest(editing._id, formData);
      } else {
        await requestService.createRequest(formData);
      }
      setShowForm(false);
      resetForm();
      await loadRequests();
    } catch (err) {
      alert(err.message || 'Lưu yêu cầu thất bại');
    }
  };

  const handleResolve = async (id) => {
    try {
      setResolvingId(id);
      await requestService.updateRequest(id, { status: 'resolved' });
      await loadRequests();
    } catch (err) {
      alert(err.message || 'Cập nhật thất bại');
    } finally {
      setResolvingId('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa yêu cầu này?')) return;
    try {
      await requestService.deleteRequest(id);
      await loadRequests();
    } catch (err) {
      alert(err.message || 'Xóa thất bại');
    }
  };

  const startEdit = (r) => {
    setEditing(r);
    setFormData({
      title: r.title || '',
      description: r.description || '',
      type: r.type || 'repair',
      priority: r.priority || 'medium',
      status: r.status || 'pending',
      tenant: r.tenant?._id || r.tenant || '',
      room: r.room?._id || r.room || '',
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Quản lý Yêu cầu</h2>
          <p className="text-gray-500 mt-1">Dữ liệu từ database qua requestService</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
          >
            {showForm ? 'Đóng' : '+ Thêm yêu cầu'}
          </button>
          <button
            onClick={loadRequests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Làm mới
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">{editing ? 'Cập nhật yêu cầu' : 'Thêm yêu cầu mới'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tiêu đề</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Loại</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="repair">Sửa chữa</option>
                <option value="complaint">Phàn nàn</option>
                <option value="service">Dịch vụ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ưu tiên</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
                <option value="urgent">Khẩn cấp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="in-progress">Đang xử lý</option>
                <option value="resolved">Đã xử lý</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Người thuê</label>
              <select
                value={formData.tenant}
                onChange={(e) => setFormData({ ...formData, tenant: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Chọn người thuê</option>
                {tenants.map((t) => (
                  <option key={t._id} value={t._id}>{t.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phòng</label>
              <select
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Chọn phòng</option>
                {rooms.map((r) => (
                  <option key={r._id} value={r._id}>Phòng {r.roomNumber}</option>
                ))}
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

      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}

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
                <div className="text-lg font-semibold text-blue-700">Thêm yêu cầu mới</div>
                <div className="text-sm text-gray-500">Tạo ticket sửa chữa / dịch vụ nhanh</div>
              </div>
            </div>
            <span className="text-sm text-blue-600 font-semibold">Mở form</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tiêu đề</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Người thuê</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Phòng</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Loại</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Ưu tiên</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{r.title}</div>
                      <div className="text-xs text-gray-500">{r.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.tenant?.fullName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.room?.roomNumber || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.type}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        r.priority === 'urgent'
                          ? 'bg-red-100 text-red-700'
                          : r.priority === 'high'
                          ? 'bg-orange-100 text-orange-700'
                          : r.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'resolved'
                          ? 'bg-green-100 text-green-700'
                          : r.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-700'
                          : r.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm space-x-2">
                      <button
                        onClick={() => startEdit(r)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        Xóa
                      </button>
                      {r.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolve(r._id)}
                          disabled={resolvingId === r._id}
                          className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50"
                        >
                          {resolvingId === r._id ? 'Đang xử lý...' : 'Đánh dấu đã xử lý'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {requests.length === 0 && <div className="p-6 text-center text-gray-500">Chưa có yêu cầu</div>}
          </div>
        </>
      )}

      {/* Floating quick add button */}
      <button
        type="button"
        onClick={() => { resetForm(); setShowForm(true); }}
        className="fixed bottom-6 right-6 px-4 py-3 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 focus:outline-none"
      >
        + Thêm yêu cầu
      </button>
    </div>
  );
}
