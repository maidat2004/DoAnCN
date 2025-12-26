import { Plus, Edit, Trash2, Search, Phone, Mail, IdCard, School, Key, Copy, CheckCircle2, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { tenantService, roomService, userService } from '../../services';

export default function TenantManagement() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTenant, setEditingTenant] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [newAccountInfo, setNewAccountInfo] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Check user role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Current user:', user);
    if (!user || user.role !== 'admin') {
      toast.error('⛔ Bạn không có quyền truy cập! Vui lòng đăng nhập bằng tài khoản admin.');
      setTimeout(() => {
        localStorage.clear();
        navigate('/');
      }, 2000);
    }
  }, [navigate]);

  // Helper function to convert ISO date to yyyy-MM-dd format
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    loadData();

    // Reload data when window gets focus (user switches back to this page)
    const handleFocus = () => {
      loadData();
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tenantsData, roomsData, usersData] = await Promise.all([
        tenantService.getTenants(),
        roomService.getRooms(),
        userService.getUsers()
      ]);
      setTenants(tenantsData);
      setRooms(roomsData);
      // Lọc chỉ lấy user chưa có tenant
      const usersWithoutTenant = usersData.filter(user => 
        user.role === 'user' && !tenantsData.some(tenant => tenant.user?._id === user._id || tenant.email === user.email)
      );
      setUsers(usersWithoutTenant);
    } catch (error) {
      toast.error('Không thể tải dữ liệu');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, field) => {
    try {
      // Try modern Clipboard API first with additional permission check
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
          await navigator.clipboard.writeText(text);
          setCopiedField(field);
          toast.success(`📋 Đã copy ${field}!`);
          setTimeout(() => setCopiedField(null), 2000);
          return;
        } catch (clipboardErr) {
          // If Clipboard API fails due to permissions, fall through to fallback
          console.log('Clipboard API failed, using fallback method');
        }
      }
      
      // Fallback for browsers that don't support Clipboard API or lack permissions
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopiedField(field);
        toast.success(`📋 Đã copy ${field}!`);
        setTimeout(() => setCopiedField(null), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
        toast.error('Không thể copy. Vui lòng copy thủ công.');
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Copy failed:', err);
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopiedField(field);
        toast.success(`📋 Đã copy ${field}!`);
        setTimeout(() => setCopiedField(null), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        toast.error('Không thể copy. Vui lòng copy thủ công.');
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone?.includes(searchTerm) ||
    tenant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.idCard?.includes(searchTerm)
  );

  const getRoomNumber = (room) => {
    if (!room) return 'Chưa có phòng';
    if (typeof room === 'object' && room.roomNumber) {
      return `Phòng ${room.roomNumber}`;
    }
    const foundRoom = rooms.find(r => r._id === room);
    return foundRoom ? `Phòng ${foundRoom.roomNumber}` : 'Chưa có phòng';
  };

  const handleAddTenant = () => {
    setSelectedUser(null);
    setEditingTenant({
      user: '',
      fullName: '',
      email: '',
      phone: '',
      idCard: '',
      dateOfBirth: '',
      hometown: '',
      currentAddress: '',
      occupation: '',
      emergencyContact: '',
      emergencyPhone: '',
      relationship: '',
      room: '',
      moveInDate: ''
    });
    setIsDialogOpen(true);
  };

  const handleUserSelect = (userId) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setEditingTenant({
        ...editingTenant,
        user: user._id,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? formatDateForInput(user.dateOfBirth) : '',
        hometown: user.hometown || '',
        currentAddress: user.currentAddress || '',
        idCard: user.idCard || '',
        occupation: user.occupation || '',
        emergencyContact: user.emergencyContact?.name || '',
        emergencyPhone: user.emergencyContact?.phone || '',
        relationship: user.emergencyContact?.relationship || '',
        room: '',
        moveInDate: ''
      });
    }
  };

  const handleEditTenant = (tenant) => {
    setEditingTenant({ 
      ...tenant,
      dateOfBirth: formatDateForInput(tenant.dateOfBirth),
      moveInDate: formatDateForInput(tenant.moveInDate)
    });
    setIsDialogOpen(true);
  };

  const handleSaveTenant = async (e) => {
    e.preventDefault();
    if (!editingTenant) return;

    console.log('Saving tenant:', editingTenant);
    console.log('Room value:', editingTenant.room);

    try {
      if (editingTenant._id) {
        // Update existing tenant
        console.log('Updating tenant with ID:', editingTenant._id);
        const result = await tenantService.updateTenant(editingTenant._id, editingTenant);
        console.log('Update result:', result);
        toast.success('✅ Cập nhật thông tin người thuê thành công!');
      } else {
        // Create new tenant (không tạo account mới, dùng user đã có)
        // Map frontend fields to backend expected fields
        const tenantData = {
          ...editingTenant,
          userId: editingTenant.user,
          roomId: editingTenant.room
        };
        delete tenantData.user;
        delete tenantData.room;
        
        const result = await tenantService.createTenant(tenantData);
        toast.success('🎉 Thêm người thuê thành công!');
      }
      
      setIsDialogOpen(false);
      setEditingTenant(null);
      setSelectedUser(null);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error saving tenant:', error);
      
      // Handle specific error messages
      const errorMessage = error.message || error.response?.data?.message || 'Không thể lưu thông tin người thuê';
      
      if (errorMessage.includes('E11000') || errorMessage.includes('duplicate key')) {
        if (errorMessage.includes('idCard')) {
          toast.error('❌ CMND/CCCD đã tồn tại trong hệ thống!');
        } else if (errorMessage.includes('email')) {
          toast.error('❌ Email đã được sử dụng!');
        } else if (errorMessage.includes('phone')) {
          toast.error('❌ Số điện thoại đã được sử dụng!');
        } else {
          toast.error('❌ Thông tin đã tồn tại trong hệ thống!');
        }
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người thuê này?')) return;
    
    try {
      await tenantService.deleteTenant(tenantId);
      toast.success('✅ Xóa người thuê thành công!');
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Không thể xóa người thuê');
      console.error('Error deleting tenant:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Quản Lý Người Thuê</h1>
          <p className="text-gray-600">Quản lý thông tin sinh viên thuê trọ và cấp phòng</p>
        </div>
        <Button 
          onClick={handleAddTenant}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg text-white"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm Người Thuê & Cấp Phòng
        </Button>
      </div>

      {/* Add/Edit Tenant Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTenant?.name ? 'Chỉnh Sửa Người Thuê' : 'Thêm Người Thuê Mới'}
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin đầy đủ của người thuê trọ
              </DialogDescription>
            </DialogHeader>
            {editingTenant && (
              <form onSubmit={handleSaveTenant} className="space-y-4">
                {/* Chọn User (chỉ hiển thị khi thêm mới) */}
                {!editingTenant._id && (
                  <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Label htmlFor="user">Chọn Tài Khoản User *</Label>
                    <Select
                      value={editingTenant.user || ''}
                      onValueChange={handleUserSelect}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn user để gán phòng" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.length === 0 ? (
                          <SelectItem value="none" disabled>
                            Không có user nào (tất cả đã có tenant)
                          </SelectItem>
                        ) : (
                          users.map(user => (
                            <SelectItem key={user._id} value={user._id}>
                              {user.name} - {user.email}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-blue-700 font-medium">
                      💡 Chọn user từ trang "Tài khoản". Thông tin cá nhân tự động điền, bạn chỉ cần chọn Phòng và Ngày chuyển vào.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Họ và Tên * {!editingTenant._id && !!selectedUser && <span className="text-green-600 text-xs">(Tự động)</span>}
                    </Label>
                    <Input
                      id="fullName"
                      value={editingTenant.fullName || ''}
                      onChange={(e) => setEditingTenant({ ...editingTenant, fullName: e.target.value })}
                      required
                      readOnly={!editingTenant._id && !!selectedUser}
                      className={!editingTenant._id && !!selectedUser ? 'bg-gray-100' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">
                      Ngày Sinh * {!editingTenant._id && !!selectedUser && <span className="text-green-600 text-xs">(Tự động)</span>}
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editingTenant.dateOfBirth || ''}
                      onChange={(e) => setEditingTenant({ ...editingTenant, dateOfBirth: e.target.value })}
                      required
                      readOnly={!editingTenant._id && !!selectedUser}
                      className={!editingTenant._id && !!selectedUser ? 'bg-gray-100' : ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Số Điện Thoại * {!editingTenant._id && !!selectedUser && <span className="text-green-600 text-xs">(Tự động)</span>}
                    </Label>
                    <Input
                      id="phone"
                      value={editingTenant.phone || ''}
                      onChange={(e) => setEditingTenant({ ...editingTenant, phone: e.target.value })}
                      required
                      readOnly={!editingTenant._id && !!selectedUser}
                      className={!editingTenant._id && !!selectedUser ? 'bg-gray-100' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email * {!editingTenant._id && !!selectedUser && <span className="text-green-600 text-xs">(Tự động)</span>}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editingTenant.email || ''}
                      onChange={(e) => setEditingTenant({ ...editingTenant, email: e.target.value })}
                      required
                      readOnly={!editingTenant._id && !!selectedUser}
                      className={!editingTenant._id && !!selectedUser ? 'bg-gray-100' : ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idCard">
                      CMND/CCCD * {!editingTenant._id && !!selectedUser && editingTenant.idCard && <span className="text-green-600 text-xs">(Tự động)</span>}
                    </Label>
                    <Input
                      id="idCard"
                      value={editingTenant.idCard || ''}
                      onChange={(e) => setEditingTenant({ ...editingTenant, idCard: e.target.value })}
                      required
                      readOnly={!editingTenant._id && !!selectedUser && !!editingTenant.idCard}
                      className={!editingTenant._id && !!selectedUser && !!editingTenant.idCard ? 'bg-gray-100' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">Trường Học (Nếu có)</Label>
                    <Input
                      id="school"
                      placeholder="Nhập tên trường nếu là sinh viên"
                      value={editingTenant.school || ''}
                      onChange={(e) => setEditingTenant({ ...editingTenant, school: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hometown">
                    Quê Quán * {!editingTenant._id && !!selectedUser && <span className="text-green-600 text-xs">(Tự động)</span>}
                  </Label>
                  <Input
                    id="hometown"
                    value={editingTenant.hometown || ''}
                    onChange={(e) => setEditingTenant({ ...editingTenant, hometown: e.target.value })}
                    required
                    readOnly={!editingTenant._id && !!selectedUser}
                    className={!editingTenant._id && !!selectedUser ? 'bg-gray-100' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentAddress">
                    Địa chỉ hiện tại {!editingTenant._id && !!selectedUser && <span className="text-green-600 text-xs">(Tự động)</span>}
                  </Label>
                  <Input
                    id="currentAddress"
                    value={editingTenant.currentAddress || ''}
                    onChange={(e) => setEditingTenant({ ...editingTenant, currentAddress: e.target.value })}
                    readOnly={!editingTenant._id && !!selectedUser}
                    className={!editingTenant._id && !!selectedUser ? 'bg-gray-100' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">
                    Nghề nghiệp {!editingTenant._id && !!selectedUser && <span className="text-green-600 text-xs">(Tự động)</span>}
                  </Label>
                  <Input
                    id="occupation"
                    value={editingTenant.occupation || ''}
                    onChange={(e) => setEditingTenant({ ...editingTenant, occupation: e.target.value })}
                    readOnly={!editingTenant._id && !!selectedUser}
                    className={!editingTenant._id && !!selectedUser ? 'bg-gray-100' : ''}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room">Phòng</Label>
                    <select
                      id="room"
                      value={editingTenant.room || 'none'}
                      onChange={(e) => {
                        console.log('Room selected:', e.target.value);
                        setEditingTenant({ ...editingTenant, room: e.target.value === 'none' ? '' : e.target.value });
                      }}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <option value="none">Chưa có phòng</option>
                      {rooms
                        .filter(room => {
                          const currentEditRoomId = editingTenant?.room?._id || editingTenant?.room;
                          
                          // Nếu đang edit và đây là phòng hiện tại → hiển thị
                          if (editingTenant?._id && room._id === currentEditRoomId) {
                            return true;
                          }
                          
                          // Hiển thị phòng có status available
                          if (room.status === 'available') {
                            return true;
                          }
                          
                          // Nếu không phải 2 trường hợp trên → ẩn
                          return false;
                        })
                        .map(room => (
                          <option key={room._id} value={room._id}>
                            Phòng {room.roomNumber} {room.status === 'available' ? '(Trống)' : '(Đã thuê)'}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moveInDate">Ngày Chuyển Vào</Label>
                    <Input
                      id="moveInDate"
                      type="date"
                      value={editingTenant.moveInDate || ''}
                      onChange={(e) => setEditingTenant({ ...editingTenant, moveInDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm text-gray-900 mb-3">Liên Hệ Khẩn Cấp (Tùy chọn)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">
                        Tên Người Liên Hệ {!editingTenant._id && !!selectedUser && <span className="text-green-600 text-xs">(Tự động)</span>}
                      </Label>
                      <Input
                        id="emergencyContact"
                        value={editingTenant.emergencyContact || ''}
                        onChange={(e) => setEditingTenant({ ...editingTenant, emergencyContact: e.target.value })}
                        readOnly={!editingTenant._id && !!selectedUser}
                        className={!editingTenant._id && !!selectedUser ? 'bg-gray-100' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">
                        Số Điện Thoại {!editingTenant._id && !!selectedUser && <span className="text-green-600 text-xs">(Tự động)</span>}
                      </Label>
                      <Input
                        id="emergencyPhone"
                        value={editingTenant.emergencyPhone || ''}
                        onChange={(e) => setEditingTenant({ ...editingTenant, emergencyPhone: e.target.value })}
                        readOnly={!editingTenant._id && !!selectedUser}
                        className={!editingTenant._id && !!selectedUser ? 'bg-gray-100' : ''}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="relationship">
                      Quan hệ {!editingTenant._id && !!selectedUser && <span className="text-green-600 text-xs">(Tự động)</span>}
                    </Label>
                    <Input
                      id="relationship"
                      value={editingTenant.relationship || ''}
                      onChange={(e) => setEditingTenant({ ...editingTenant, relationship: e.target.value })}
                      placeholder="Cha, Mẹ, Anh chị em..."
                      readOnly={!editingTenant._id && !!selectedUser}
                      className={!editingTenant._id && !!selectedUser ? 'bg-gray-100' : ''}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="px-6"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8"
                  >
                    {editingTenant?._id ? 'Cập Nhật' : 'Thêm Người Thuê'}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên, SĐT, email, CMND..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tenants List */}
      {loading ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Đang tải...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : filteredTenants.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Không tìm thấy người thuê nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTenants.map((tenant) => (
          <Card key={tenant._id}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{tenant.fullName}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {getRoomNumber(tenant.room)}
                  </p>
                </div>
                {tenant.room && tenant.room !== 'none' && tenant.room !== '' ? (
                  <Badge className="bg-blue-100 text-blue-700">Đang thuê</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-600">Chưa có phòng</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Room Info - Prominent Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-xs text-blue-600 font-medium">Phòng</span>
                    <p className="text-lg font-bold text-blue-900">
                      {tenant.room && tenant.room !== 'none' && tenant.room !== '' 
                        ? getRoomNumber(tenant.room)
                        : 'Chưa cấp phòng'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">SĐT:</span>
                  <span className="text-gray-900">{tenant.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900 truncate">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IdCard className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">CMND:</span>
                  <span className="text-gray-900">{tenant.idCard}</span>
                </div>
                {tenant.school && (
                  <div className="flex items-center gap-2 text-sm">
                    <School className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Trường:</span>
                    <span className="text-gray-900 truncate">{tenant.school}</span>
                  </div>
                )}
                {tenant.moveInDate && (
                  <div className="flex items-center gap-2 text-sm bg-green-50 -mx-2 px-2 py-1.5 rounded">
                    <Key className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Ngày thuê:</span>
                    <span className="text-green-700 font-medium">
                      {new Date(tenant.moveInDate).toLocaleDateString('vi-VN', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditTenant(tenant)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteTenant(tenant._id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Account Info Dialog */}
      <Dialog open={showAccountInfo} onOpenChange={setShowAccountInfo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🎉 Tài Khoản Đã Được Tạo!
            </DialogTitle>
            <DialogDescription>
              Thông tin đăng nhập cho sinh viên
            </DialogDescription>
          </DialogHeader>
          
          {newAccountInfo && (
            <div className="space-y-4">
              {/* Success message */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-green-900">Tạo tài khoản thành công!</p>
                    <p className="text-xs text-green-700">Hãy gửi thông tin này cho sinh viên</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email đăng nhập
                </Label>
                <div className="flex gap-2">
                  <Input 
                    value={newAccountInfo.email} 
                    readOnly 
                    className="bg-gray-50"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(newAccountInfo.email, 'Email')}
                    className="flex-shrink-0"
                  >
                    {copiedField === 'Email' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700">
                  <Key className="w-4 h-4 text-purple-500" />
                  Mật khẩu
                </Label>
                <div className="flex gap-2">
                  <Input 
                    value={newAccountInfo.password} 
                    readOnly 
                    className="bg-gray-50 font-mono"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(newAccountInfo.password, 'Mật khẩu')}
                    className="flex-shrink-0"
                  >
                    {copiedField === 'Mật khẩu' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Info note */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💡</span>
                  </div>
                  <div className="text-sm text-amber-900 space-y-2">
                    <p><strong>Lưu ý:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Mật khẩu mặc định là <strong>số CMND/CCCD</strong></li>
                      <li>Sinh viên nên đổi mật khẩu sau lần đăng nhập đầu tiên</li>
                      <li>Click nút Copy để sao chép thông tin</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setShowAccountInfo(false);
                    setNewAccountInfo(null);
                  }}
                >
                  Đã Hiểu
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}