import { useEffect, useState } from 'react';
import { contractService, roomService, tenantService } from '../../services';

export default function ContractManagement() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [formData, setFormData] = useState({
    contractNumber: '',
    room: '',
    tenant: '',
    startDate: '',
    endDate: '',
    monthlyRent: 0,
    deposit: 0,
    paymentDate: 5,
    status: 'active',
  });

  const loadContracts = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, roomList, tenantList] = await Promise.all([
        contractService.getContracts(),
        roomService.getRooms(),
        tenantService.getTenants(),
      ]);
      setContracts(data);
      setRooms(roomList);
      setTenants(tenantList);
    } catch (err) {
      setError(err.message || 'Không tải được hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setFormData({
      contractNumber: '',
      room: rooms[0]?._id || '',
      tenant: tenants[0]?._id || '',
      startDate: '',
      endDate: '',
      monthlyRent: 0,
      deposit: 0,
      paymentDate: 5,
      status: 'active',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await contractService.updateContract(editing._id, formData);
      } else {
        await contractService.createContract(formData);
      }
      setShowForm(false);
      resetForm();
      await loadContracts();
    } catch (err) {
      alert(err.message || 'Lưu hợp đồng thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa hợp đồng này?')) return;
    try {
      setDeletingId(id);
      await contractService.deleteContract(id);
      await loadContracts();
    } catch (err) {
      alert(err.message || 'Xóa thất bại');
    } finally {
      setDeletingId('');
    }
  };

  const startEdit = (c) => {
    setEditing(c);
    setFormData({
      contractNumber: c.contractNumber || '',
      room: c.room?._id || c.room || '',
      tenant: c.tenant?._id || c.tenant || '',
      startDate: c.startDate ? c.startDate.substring(0,10) : '',
      endDate: c.endDate ? c.endDate.substring(0,10) : '',
      monthlyRent: c.monthlyRent || 0,
      deposit: c.deposit || 0,
      paymentDate: c.paymentDate || 5,
      status: c.status || 'active',
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Quản lý Hợp đồng</h2>
          <p className="text-gray-500 mt-1">Lấy dữ liệu từ database (contractService)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
          >
            {showForm ? 'Đóng' : '+ Thêm hợp đồng'}
          </button>
          <button
            onClick={loadContracts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Làm mới
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">{editing ? 'Cập nhật hợp đồng' : 'Thêm hợp đồng mới'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mã hợp đồng</label>
              <input
                type="text"
                value={formData.contractNumber}
                onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
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
              <label className="block text-sm font-medium mb-2">Ngày bắt đầu</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngày kết thúc</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giá thuê</label>
              <input
                type="number"
                value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Đặt cọc</label>
              <input
                type="number"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngày thanh toán (1-28)</label>
              <input
                type="number"
                min={1}
                max={28}
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="active">Hiệu lực</option>
                <option value="expired">Hết hạn</option>
                <option value="terminated">Đã hủy</option>
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
                <div className="text-lg font-semibold text-blue-700">Thêm hợp đồng mới</div>
                <div className="text-sm text-gray-500">Mở form để nhập thông tin hợp đồng</div>
              </div>
            </div>
            <span className="text-sm text-blue-600 font-semibold">Mở form</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Mã HĐ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Phòng</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Người thuê</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Thời hạn</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Giá thuê</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contracts.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {c.contractNumber}
                      <div className="text-xs text-gray-500">ID: {c._id}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.room?.roomNumber || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.tenant?.fullName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {c.startDate ? new Date(c.startDate).toLocaleDateString('vi-VN') : '—'}
                      {' - '}
                      {c.endDate ? new Date(c.endDate).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {c.monthlyRent?.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        c.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : c.status === 'expired'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {c.status === 'active' ? 'Hiệu lực' : c.status === 'expired' ? 'Hết hạn' : 'Đã huỷ'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm space-x-2">
                      <button
                        onClick={() => startEdit(c)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        disabled={deletingId === c._id}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                      >
                        {deletingId === c._id ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {contracts.length === 0 && <div className="p-6 text-center text-gray-500">Chưa có hợp đồng</div>}
          </div>
        </>
      )}

      {/* Floating quick add button */}
      <button
        type="button"
        onClick={() => { resetForm(); setShowForm(true); }}
        className="fixed bottom-6 right-6 px-4 py-3 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 focus:outline-none"
      >
        + Thêm hợp đồng
      </button>
    </div>
  );
}
