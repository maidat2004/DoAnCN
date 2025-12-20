import { useEffect, useState } from 'react';
import { invoiceService, tenantService, roomService } from '../../services';

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState('');
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    tenant: '',
    room: '',
    month: 1,
    year: new Date().getFullYear(),
    roomRent: 0,
    totalAmount: 0,
    dueDate: '',
    status: 'pending',
    paymentMethod: 'cash',
  });

  const loadInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const [data, tenantList, roomList] = await Promise.all([
        invoiceService.getInvoices(),
        tenantService.getTenants(),
        roomService.getRooms(),
      ]);
      setInvoices(data);
      setTenants(tenantList);
      setRooms(roomList);
    } catch (err) {
      setError(err.message || 'Không tải được hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setFormData({
      invoiceNumber: '',
      tenant: tenants[0]?._id || '',
      room: rooms[0]?._id || '',
      month: 1,
      year: new Date().getFullYear(),
      roomRent: 0,
      totalAmount: 0,
      dueDate: '',
      status: 'pending',
      paymentMethod: 'cash',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, totalAmount: formData.totalAmount || formData.roomRent };
      if (editing) {
        await invoiceService.updateInvoice(editing._id, payload);
      } else {
        await invoiceService.createInvoice(payload);
      }
      setShowForm(false);
      resetForm();
      await loadInvoices();
    } catch (err) {
      alert(err.message || 'Lưu hóa đơn thất bại');
    }
  };

  const handlePay = async (id) => {
    try {
      setPayingId(id);
      await invoiceService.payInvoice(id, 'cash');
      await loadInvoices();
    } catch (err) {
      alert(err.message || 'Thanh toán thất bại');
    } finally {
      setPayingId('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa hóa đơn này?')) return;
    try {
      await invoiceService.deleteInvoice(id);
      await loadInvoices();
    } catch (err) {
      alert(err.message || 'Xóa thất bại');
    }
  };

  const startEdit = (inv) => {
    setEditing(inv);
    setFormData({
      invoiceNumber: inv.invoiceNumber || '',
      tenant: inv.tenant?._id || inv.tenant || '',
      room: inv.room?._id || inv.room || '',
      month: inv.month || 1,
      year: inv.year || new Date().getFullYear(),
      roomRent: inv.roomRent || 0,
      totalAmount: inv.totalAmount || inv.roomRent || 0,
      dueDate: inv.dueDate ? inv.dueDate.substring(0,10) : '',
      status: inv.status || 'pending',
      paymentMethod: inv.paymentMethod || 'cash',
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Quản lý Hóa đơn</h2>
          <p className="text-gray-500 mt-1">Kết nối database qua invoiceService</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
          >
            {showForm ? 'Đóng' : '+ Thêm hóa đơn'}
          </button>
          <button
            onClick={loadInvoices}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Làm mới
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">{editing ? 'Cập nhật hóa đơn' : 'Thêm hóa đơn mới'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mã hóa đơn</label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Khách thuê</label>
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
            <div>
              <label className="block text-sm font-medium mb-2">Tháng</label>
              <input
                type="number"
                min={1}
                max={12}
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Năm</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tiền phòng</label>
              <input
                type="number"
                value={formData.roomRent}
                onChange={(e) => setFormData({ ...formData, roomRent: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tổng tiền</label>
              <input
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hạn thanh toán</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phương thức</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="cash">Tiền mặt</option>
                <option value="transfer">Chuyển khoản</option>
                <option value="momo">Momo</option>
                <option value="vnpay">VNPay</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="pending">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="overdue">Quá hạn</option>
                <option value="cancelled">Đã hủy</option>
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
                <div className="text-lg font-semibold text-blue-700">Thêm hóa đơn mới</div>
                <div className="text-sm text-gray-500">Tạo hóa đơn và gán cho phòng/người thuê</div>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Khách</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Phòng</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tháng</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tổng tiền</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {inv.invoiceNumber}
                      <div className="text-xs text-gray-500">ID: {inv._id}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{inv.tenant?.fullName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{inv.room?.roomNumber || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{inv.month}/{inv.year}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{inv.totalAmount?.toLocaleString('vi-VN')} đ</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        inv.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : inv.status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {inv.status === 'paid'
                          ? 'Đã thanh toán'
                          : inv.status === 'overdue'
                          ? 'Quá hạn'
                          : inv.status === 'cancelled'
                          ? 'Đã hủy'
                          : 'Chưa thanh toán'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm space-x-2">
                      <button
                        onClick={() => startEdit(inv)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(inv._id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        Xóa
                      </button>
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => handlePay(inv._id)}
                          disabled={payingId === inv._id}
                          className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50"
                        >
                          {payingId === inv._id ? 'Đang xử lý...' : 'Đánh dấu đã trả'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {invoices.length === 0 && <div className="p-6 text-center text-gray-500">Chưa có hóa đơn</div>}
          </div>
        </>
      )}

      {/* Floating quick add button */}
      <button
        type="button"
        onClick={() => { resetForm(); setShowForm(true); }}
        className="fixed bottom-6 right-6 px-4 py-3 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 focus:outline-none"
      >
        + Thêm hóa đơn
      </button>
    </div>
  );
}
