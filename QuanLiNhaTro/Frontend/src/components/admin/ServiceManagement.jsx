import { useEffect, useState } from 'react';
import { serviceService } from '../../services';

const defaultForm = {
  name: '',
  type: 'other',
  unitPrice: 0,
  unit: '',
  description: '',
  isActive: true,
};

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const loadServices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await serviceService.getServices();
      setServices(data);
    } catch (err) {
      setError(err.message || 'Không tải được dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await serviceService.updateService(editing._id, formData);
      } else {
        await serviceService.createService(formData);
      }
      setShowForm(false);
      setEditing(null);
      setFormData(defaultForm);
      await loadServices();
    } catch (err) {
      alert(err.message || 'Lưu thất bại');
    }
  };

  const handleEdit = (svc) => {
    setEditing(svc);
    setFormData({
      name: svc.name,
      type: svc.type,
      unitPrice: svc.unitPrice,
      unit: svc.unit,
      description: svc.description || '',
      isActive: svc.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa dịch vụ này?')) return;
    try {
      await serviceService.deleteService(id);
      await loadServices();
    } catch (err) {
      alert(err.message || 'Xóa thất bại');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Quản lý Dịch vụ</h2>
          <p className="text-gray-500 mt-1">Kết nối database qua serviceService</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setEditing(null); setFormData(defaultForm); setShowForm(!showForm); }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
          >
            {showForm ? 'Đóng' : '+ Thêm dịch vụ'}
          </button>
          <button
            onClick={loadServices}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Làm mới
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">{editing ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên dịch vụ</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <option value="electricity">Điện</option>
                <option value="water">Nước</option>
                <option value="internet">Internet</option>
                <option value="parking">Gửi xe</option>
                <option value="cleaning">Dọn phòng</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Đơn giá</label>
              <input
                type="number"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Đơn vị</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="kWh, m³, tháng, ..."
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">Kích hoạt</label>
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
                onClick={() => { setShowForm(false); setEditing(null); setFormData(defaultForm); }}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">Đang tải...</div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => { setEditing(null); setFormData(defaultForm); setShowForm(true); }}
            className="w-full mb-4 text-left border-2 border-dashed border-blue-300 rounded-xl bg-white p-4 flex items-center justify-between hover:border-blue-500 hover:bg-blue-50 transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">+</div>
              <div>
                <div className="text-lg font-semibold text-blue-700">Thêm dịch vụ mới</div>
                <div className="text-sm text-gray-500">Nhấn để mở form cấu hình giá/đơn vị</div>
              </div>
            </div>
            <span className="text-sm text-blue-600 font-semibold">Mở form</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tên dịch vụ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Loại</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Đơn giá</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Đơn vị</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.unitPrice?.toLocaleString('vi-VN')} đ</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.unit}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {s.isActive ? 'Đang dùng' : 'Tắt'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {services.length === 0 && <div className="p-6 text-center text-gray-500">Chưa có dịch vụ</div>}
          </div>
        </>
      )}

      {/* Floating quick add button */}
      <button
        type="button"
        onClick={() => { setEditing(null); setFormData(defaultForm); setShowForm(true); }}
        className="fixed bottom-6 right-6 px-4 py-3 rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 focus:outline-none"
      >
        + Thêm dịch vụ
      </button>
    </div>
  );
}
