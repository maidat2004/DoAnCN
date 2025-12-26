import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { tenantService, authService } from '../../services';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Edit, Save, X, Lock, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tenantInfo, setTenantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    hometown: '',
    school: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
      
      // Populate edit form
      setEditForm({
        fullName: data.fullName || '',
        phone: data.phone || '',
        email: data.email || '',
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
        hometown: data.hometown || '',
        school: data.school || '',
        emergencyContact: data.emergencyContact?.name || '',
        emergencyPhone: data.emergencyContact?.phone || ''
      });
    } catch (err) {
      setError('Không thể tải thông tin người thuê');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (tenantInfo) {
      setEditForm({
        fullName: tenantInfo.fullName || '',
        phone: tenantInfo.phone || '',
        email: tenantInfo.email || '', // Read-only, for display
        dateOfBirth: tenantInfo.dateOfBirth ? new Date(tenantInfo.dateOfBirth).toISOString().split('T')[0] : '',
        hometown: tenantInfo.hometown || '',
        school: tenantInfo.school || '',
        emergencyContact: tenantInfo.emergencyContact?.name || '',
        emergencyPhone: tenantInfo.emergencyContact?.phone || ''
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Remove email from update payload (read-only field)
      const { email, ...updateData } = editForm;
      
      // Convert emergency contact to object format
      const emergencyContact = {
        name: updateData.emergencyContact || '',
        phone: updateData.emergencyPhone || '',
        relationship: '' // Optional, can be added later if needed
      };
      
      const finalUpdateData = {
        ...updateData,
        emergencyContact
      };
      
      // Remove the separate emergencyContact and emergencyPhone fields
      delete finalUpdateData.emergencyContact;
      delete finalUpdateData.emergencyPhone;
      
      // Use the new endpoint for users to update their own profile
      await tenantService.updateOwnProfile(finalUpdateData);
      toast.success('✅ Cập nhật thông tin thành công!');
      setIsEditDialogOpen(false);
      await loadTenantInfo(); // Reload data
    } catch (err) {
      toast.error('❌ Không thể cập nhật thông tin');
      console.error(err);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('❌ Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('❌ Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('❌ Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      toast.success('✅ Đổi mật khẩu thành công!');
      setIsPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || '❌ Không thể đổi mật khẩu');
      console.error(err);
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
        <div className="flex gap-3">
          <Button
            onClick={() => setIsPasswordDialogOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Lock className="w-4 h-4 mr-2" />
            Đổi mật khẩu
          </Button>
          {tenantInfo && (
            <Button
              onClick={handleEditClick}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Edit className="w-4 h-4 mr-2" />
              Cập nhật thông tin
            </Button>
          )}
        </div>
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
              <p className="text-gray-800 mt-1 font-semibold">{tenantInfo.fullName || 'Chưa cập nhật'}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">CMND/CCCD</label>
              <p className="text-gray-800 mt-1 font-mono">{tenantInfo.idCard || 'Chưa cập nhật'}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
              <p className="text-gray-800 mt-1">{tenantInfo.phone || 'Chưa cập nhật'}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-800 mt-1">{tenantInfo.email || 'Chưa cập nhật'}</p>
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
              <label className="text-sm font-medium text-gray-500">Trường học</label>
              <p className="text-gray-800 mt-1">{tenantInfo.school || 'Chưa cập nhật'}</p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Phòng</label>
              <p className="text-gray-800 mt-1">
                {tenantInfo.room?.roomNumber ? `Phòng ${tenantInfo.room.roomNumber}` : 'Chưa được gán phòng'}
              </p>
            </div>
            <div className="border-b pb-3">
              <label className="text-sm font-medium text-gray-500">Ngày vào ở</label>
              <p className="text-gray-800 mt-1">{formatDate(tenantInfo.moveInDate)}</p>
            </div>
          </div>

          {/* Thông tin liên hệ khẩn cấp */}
          {(tenantInfo.emergencyContact?.name || tenantInfo.emergencyContact?.phone) && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-xl mr-2">🚨</span>
                Liên hệ khẩn cấp
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Người liên hệ</label>
                  <p className="text-gray-800 mt-1">{tenantInfo.emergencyContact?.name || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                  <p className="text-gray-800 mt-1">{tenantInfo.emergencyContact?.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg">
          <p className="font-medium">Chưa có thông tin người thuê</p>
          <p className="text-sm mt-1">Vui lòng liên hệ quản trị viên để cập nhật thông tin.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
              <Edit className="w-6 h-6" />
              Cập nhật thông tin cá nhân
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">📝 Thông tin cơ bản</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên đầy đủ *</Label>
                  <Input
                    id="fullName"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    placeholder="0912345678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email đăng nhập</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">
                    ⚠️ Email đăng nhập không thể thay đổi. Liên hệ admin nếu cần đổi.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hometown">Quê quán</Label>
                  <Input
                    id="hometown"
                    value={editForm.hometown}
                    onChange={(e) => setEditForm({...editForm, hometown: e.target.value})}
                    placeholder="Hà Nội"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">Trường học/Công ty</Label>
                  <Input
                    id="school"
                    value={editForm.school}
                    onChange={(e) => setEditForm({...editForm, school: e.target.value})}
                    placeholder="Đại học ABC"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin liên hệ khẩn cấp */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">🚨 Liên hệ khẩn cấp</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Tên người liên hệ</Label>
                  <Input
                    id="emergencyContact"
                    value={editForm.emergencyContact}
                    onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value})}
                    placeholder="Họ tên người thân"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Số điện thoại khẩn cấp</Label>
                  <Input
                    id="emergencyPhone"
                    value={editForm.emergencyPhone}
                    onChange={(e) => setEditForm({...editForm, emergencyPhone: e.target.value})}
                    placeholder="0912345678"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="px-6"
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button
                onClick={handleSaveChanges}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6"
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                <Lock className="w-6 h-6" />
                Đổi mật khẩu
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại *</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <p className="font-medium mb-1">⚠️ Lưu ý:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Mật khẩu phải có ít nhất 6 ký tự</li>
                  <li>Nên sử dụng kết hợp chữ, số và ký tự đặc biệt</li>
                  <li>Không chia sẻ mật khẩu với người khác</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsPasswordDialogOpen(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-6"
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
                <Button
                  onClick={handleChangePassword}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
