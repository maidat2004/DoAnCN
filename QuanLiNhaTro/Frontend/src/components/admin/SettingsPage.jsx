export default function SettingsPage({ user }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Cài đặt</h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Thông tin tài khoản</h3>
        <div className="space-y-3">
          <p><strong>Tên:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Vai trò:</strong> {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</p>
        </div>
      </div>
    </div>
  );
}
