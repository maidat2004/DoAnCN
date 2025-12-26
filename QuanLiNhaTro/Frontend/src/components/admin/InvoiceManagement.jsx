import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Plus, Search, Eye, CheckCircle, XCircle, Receipt as ReceiptIcon, Mail, Bell } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import { tenantService } from '../../services/tenantService';
import { roomService } from '../../services/roomService';
import { serviceService } from '../../services/serviceService';
import { toast } from 'sonner';

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState(null);
  const [reminders, setReminders] = useState([]);

  // Fetch all data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invoicesData, tenantsData, roomsData, servicesData] = await Promise.all([
        invoiceService.getInvoices(),
        tenantService.getTenants(),
        roomService.getRooms(),
        serviceService.getServices()
      ]);
      setInvoices(invoicesData);
      setTenants(tenantsData);
      setRooms(roomsData);
      setServices(servicesData);
      
      // Calculate reminders
      calculateReminders(tenantsData, invoicesData);
    } catch (error) {
      toast.error('Không thể tải dữ liệu');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateReminders = (tenantsData, invoicesData) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const today = now.getDate();
    
    const reminderList = [];
    
    // Filter tenants with rooms
    const activeTenants = tenantsData.filter(t => t.room && t.room._id);
    
    console.log('Calculating reminders:', { activeTenants: activeTenants.length, currentMonth, currentYear });
    
    for (const tenant of activeTenants) {
      // Check if invoice exists for current month
      const hasInvoiceThisMonth = invoicesData.some(
        inv => inv.tenant?._id === tenant._id && inv.month === currentMonth && inv.year === currentYear
      );
      
      console.log(`Tenant ${tenant.fullName}:`, { hasInvoiceThisMonth });
      
      if (hasInvoiceThisMonth) continue;
      
      // Get last paid invoice
      const paidInvoices = invoicesData
        .filter(inv => inv.tenant?._id === tenant._id && inv.status === 'paid' && inv.paidDate)
        .sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate));
      
      let dueDate;
      let reason;
      let priority = 'medium';
      
      if (paidInvoices.length > 0) {
        const lastPaidDate = new Date(paidInvoices[0].paidDate);
        dueDate = lastPaidDate.getDate();
        reason = `Đã thanh toán HĐ trước ngày ${lastPaidDate.getDate()}/${lastPaidDate.getMonth() + 1}`;
        
        // Check if passed due date
        const daysDiff = today - dueDate;
        if (daysDiff >= 0) {
          priority = 'high';
          reason = `⏰ Đến hạn (HĐ trước: ${lastPaidDate.getDate()}/${lastPaidDate.getMonth() + 1})`;
        }
      } else if (tenant.moveInDate) {
        const moveIn = new Date(tenant.moveInDate);
        dueDate = moveIn.getDate();
        reason = `Ngày vào: ${moveIn.getDate()}/${moveIn.getMonth() + 1}/${moveIn.getFullYear()}`;
        
        // Check if passed due date
        const daysDiff = today - dueDate;
        if (daysDiff >= 0) {
          priority = 'high';
          reason = `⏰ Đến hạn (Ngày vào: ${moveIn.getDate()}/${moveIn.getMonth() + 1})`;
        }
      } else {
        dueDate = 1;
        reason = 'Chưa có lịch sử thanh toán';
        priority = 'high';
      }
      
      // Always add if no invoice this month
      reminderList.push({
        tenant,
        dueDate,
        reason,
        priority
      });
    }
    
    console.log('Reminders:', reminderList);
    
    // Sort: high priority first
    setReminders(reminderList.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return 0;
    }));
  };

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getInvoices();
      setInvoices(data);
    } catch (error) {
      toast.error('Không thể tải danh sách hóa đơn');
      console.error('Error fetching invoices:', error);
    }
  };

  const uniqueMonths = Array.from(new Set(invoices.filter(inv => inv.month).map(inv => inv.month))).sort((a, b) => b - a);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.tenant?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesMonth = filterMonth === 'all' || invoice.month === parseInt(filterMonth);
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      unpaid: 'bg-yellow-100 text-yellow-700',
      overdue: 'bg-red-100 text-red-700'
    };
    const labels = {
      paid: 'Đã thanh toán',
      unpaid: 'Chưa thanh toán',
      overdue: 'Quá hạn'
    };
    return (
      <Badge className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getTenantName = (invoice) => {
    return invoice?.tenant?.fullName || 'N/A';
  };

  const getRoomNumber = (invoice) => {
    return invoice?.room?.roomNumber || 'N/A';
  };

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };

  const handleMarkPaid = async (invoiceId) => {
    try {
      await invoiceService.payInvoice(invoiceId);
      await fetchInvoices(); // Reload danh sách
      toast.success('Đã đánh dấu hóa đơn đã thanh toán');
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái hóa đơn');
      console.error('Error marking invoice as paid:', error);
    }
  };

  const handleSendInvoice = async (invoiceId) => {
    try {
      await invoiceService.sendInvoice(invoiceId);
      await fetchInvoices(); // Reload danh sách
      toast.success('Đã gửi hóa đơn qua email thành công');
    } catch (error) {
      toast.error('Không thể gửi hóa đơn qua email');
      console.error('Error sending invoice:', error);
    }
  };

  const handleMarkUnpaid = async (invoiceId) => {
    try {
      await invoiceService.updateInvoice(invoiceId, { status: 'unpaid' });
      await fetchInvoices(); // Reload danh sách
      toast.success('Đã đánh dấu hóa đơn chưa thanh toán');
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái hóa đơn');
      console.error('Error marking invoice as unpaid:', error);
    }
  };

  const handleQuickCreateInvoice = (tenant) => {
    // Pre-fill form with tenant data
    handleCreateInvoice();
    setTimeout(() => {
      if (newInvoice) {
        setNewInvoice(prev => ({
          ...prev,
          tenant: tenant._id,
          room: tenant.room?._id || tenant.room
        }));
      }
    }, 100);
  };

  const handleCreateInvoice = async () => {
    if (!newInvoice) {
      // Get default prices from services
      console.log('All services:', services);
      const electricService = services.find(s => s.type === 'electricity');
      const waterService = services.find(s => s.type === 'water');
      
      console.log('Electric service:', electricService);
      console.log('Water service:', waterService);
      
      // Initialize new invoice with default prices
      setNewInvoice({
        tenant: '',
        room: '',
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        roomPrice: 0,
        electricUsage: 0,
        electricPrice: electricService?.unitPrice || 3500,
        waterUsage: 0,
        waterPrice: waterService?.unitPrice || 20000,
        additionalServices: [],
        dueDate: '',
        status: 'unpaid'
      });
      
      console.log('Initial invoice:', {
        electricPrice: electricService?.unitPrice || 3500,
        waterPrice: waterService?.unitPrice || 20000
      });
      
      setIsCreateOpen(true);
      return;
    }

    // Save invoice
    try {
      if (!newInvoice.tenant || !newInvoice.room) {
        toast.error('Vui lòng chọn người thuê và phòng');
        return;
      }

      await invoiceService.createInvoice(newInvoice);
      toast.success('Tạo hóa đơn thành công');
      setIsCreateOpen(false);
      setNewInvoice(null);
      await loadData();
    } catch (error) {
      toast.error('Không thể tạo hóa đơn');
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Quản Lý Hoá Đơn</h1>
          <p className="text-gray-600">Quản lý hoá đơn và thanh toán</p>
        </div>
        <Button 
          onClick={handleCreateInvoice}
          className="bg-white hover:bg-gray-50 text-blue-600 border border-gray-200 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo Hoá Đơn Mới
        </Button>
      </div>

      {/* Reminders Section */}
      {reminders.length > 0 && (
        <Card className="bg-white border border-gray-200 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-gray-900">Nhắc Nhở Tạo Hóa Đơn ({reminders.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reminders.map((reminder, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{reminder.tenant.fullName}</p>
                    <p className="text-sm text-gray-600">
                      Phòng {reminder.tenant.room?.roomNumber || 'N/A'} - {reminder.reason}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      {reminder.priority === 'high' ? '🔴 Đã tới ngày thanh toán' : '⚠️ Sắp tới ngày thanh toán'}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleQuickCreateInvoice(reminder.tenant)}
                    className="bg-white hover:bg-gray-50 text-orange-600 border border-orange-300 shadow-sm hover:shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tạo HĐ
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-white border border-gray-200 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên người thuê hoặc số phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Lọc theo tháng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tháng</SelectItem>
                {uniqueMonths.map(month => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                <SelectItem value="overdue">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      {loading ? (
        <Card className="bg-white border border-gray-200 shadow-md">
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Đang tải...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border border-gray-200 shadow-md">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left text-xs text-gray-600 px-6 py-3">Tháng</th>
                    <th className="text-left text-xs text-gray-600 px-6 py-3">Người Thuê</th>
                    <th className="text-left text-xs text-gray-600 px-6 py-3">Phòng</th>
                    <th className="text-right text-xs text-gray-600 px-6 py-3">Tổng Tiền</th>
                    <th className="text-left text-xs text-gray-600 px-6 py-3">Hạn Thanh Toán</th>
                    <th className="text-center text-xs text-gray-600 px-6 py-3">Trạng Thái</th>
                    <th className="text-center text-xs text-gray-600 px-6 py-3">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredInvoices.map(invoice => (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{invoice.month}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {getTenantName(invoice)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Phòng {getRoomNumber(invoice)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(invoice.dueDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetail(invoice)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => handleSendInvoice(invoice._id)}
                            title="Gửi hóa đơn qua email"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          {invoice.status === 'unpaid' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleMarkPaid(invoice._id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-yellow-600 hover:text-yellow-700"
                              onClick={() => handleMarkUnpaid(invoice._id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredInvoices.length === 0 && (
        <Card className="bg-white border border-gray-200 shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Không tìm thấy hoá đơn nào</p>
          </CardContent>
        </Card>
      )}

      {/* Invoice Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi Tiết Hoá Đơn</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về hoá đơn
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl text-gray-900">{getTenantName(selectedInvoice)}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Phòng {getRoomNumber(selectedInvoice)} - Tháng {selectedInvoice.month}
                  </p>
                </div>
                {getStatusBadge(selectedInvoice.status)}
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiền phòng:</span>
                  <span className="text-gray-900">{formatCurrency(selectedInvoice.roomPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Tiền điện ({selectedInvoice.electricUsage} kWh):
                  </span>
                  <span className="text-gray-900">{formatCurrency(selectedInvoice.electricCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Tiền nước ({selectedInvoice.waterUsage} m³):
                  </span>
                  <span className="text-gray-900">{formatCurrency(selectedInvoice.waterCost)}</span>
                </div>
                {selectedInvoice.additionalServices?.map((service, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{service.name}:</span>
                    <span className="text-gray-900">{formatCurrency(service.cost)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-gray-900">{formatCurrency(selectedInvoice.totalAmount)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hạn thanh toán:</span>
                  <span className="text-gray-900">
                    {new Date(selectedInvoice.dueDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                {selectedInvoice.paidDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngày thanh toán:</span>
                    <span className="text-gray-900">
                      {new Date(selectedInvoice.paidDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Đóng
                </Button>
                {selectedInvoice.status === 'unpaid' ? (
                  <Button onClick={() => {
                    handleMarkPaid(selectedInvoice._id);
                    setIsDetailOpen(false);
                  }}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Đánh Dấu Đã Thanh Toán
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => {
                    handleMarkUnpaid(selectedInvoice._id);
                    setIsDetailOpen(false);
                  }}>
                    Đánh Dấu Chưa Thanh Toán
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo Hóa Đơn Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết để tạo hóa đơn mới
            </DialogDescription>
          </DialogHeader>
          {newInvoice && (
            <form onSubmit={(e) => { e.preventDefault(); handleCreateInvoice(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Người thuê *</Label>
                  <Select
                    value={newInvoice.tenant}
                    onValueChange={async (value) => {
                      const tenant = tenants.find(t => t._id === value);
                      console.log('Selected tenant:', tenant);
                      
                      // Get room from tenant's room field (which might be an object or just an ID)
                      const roomId = tenant?.room?._id || tenant?.room;
                      console.log('Room ID:', roomId);
                      
                      // Try multiple ways to get room price
                      let roomPrice = 0;
                      
                      // Method 1: From tenant.room if populated with price
                      if (tenant?.room?.price) {
                        roomPrice = tenant.room.price;
                        console.log('Got price from tenant.room.price:', roomPrice);
                      }
                      // Method 2: From rooms array
                      else if (roomId) {
                        const room = rooms.find(r => r._id === roomId);
                        if (room?.price) {
                          roomPrice = room.price;
                          console.log('Got price from rooms array:', roomPrice);
                        }
                        // Method 3: Fetch room details from API
                        else {
                          try {
                            const roomData = await roomService.getRoom(roomId);
                            if (roomData?.price) {
                              roomPrice = roomData.price;
                              console.log('Got price from API:', roomPrice);
                            }
                          } catch (error) {
                            console.error('Failed to fetch room price:', error);
                          }
                        }
                      }
                      
                      console.log('Base room price:', roomPrice);
                      
                      // Calculate actual room price based on days
                      let actualRoomPrice = roomPrice;
                      let daysInfo = '';
                      
                      try {
                        // Get previous invoices for this tenant
                        const tenantInvoices = await invoiceService.getInvoicesByTenant(value);
                        console.log('Tenant invoices:', tenantInvoices);
                        
                        // Sort by date descending to get the latest paid invoice
                        const paidInvoices = tenantInvoices
                          .filter(inv => inv.status === 'paid' && inv.paidDate)
                          .sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate));
                        
                        const today = new Date();
                        let startDate;
                        
                        if (paidInvoices.length > 0) {
                          // Calculate from last paid date
                          startDate = new Date(paidInvoices[0].paidDate);
                          daysInfo = 'Tính từ ngày thanh toán hóa đơn trước';
                        } else if (tenant?.moveInDate) {
                          // First invoice - calculate from move-in date
                          startDate = new Date(tenant.moveInDate);
                          daysInfo = 'Tháng đầu tiên - tính từ ngày vào';
                        } else {
                          // Default: full month
                          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                          daysInfo = 'Tính theo tháng đầy đủ';
                        }
                        
                        // Calculate days
                        const diffTime = Math.abs(today - startDate);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        // Calculate price per day (assume 30 days per month)
                        const pricePerDay = roomPrice / 30;
                        actualRoomPrice = Math.round(pricePerDay * diffDays);
                        
                        console.log('Days calculation:', {
                          startDate: startDate.toLocaleDateString('vi-VN'),
                          today: today.toLocaleDateString('vi-VN'),
                          diffDays,
                          pricePerDay,
                          actualRoomPrice,
                          info: daysInfo
                        });
                        
                        // Show notification
                        toast.info(`${daysInfo}: ${diffDays} ngày × ${formatCurrency(pricePerDay)}/ngày = ${formatCurrency(actualRoomPrice)}`, {
                          duration: 5000
                        });
                      } catch (error) {
                        console.error('Error calculating room price:', error);
                        actualRoomPrice = roomPrice;
                      }
                      
                      console.log('Final room price:', actualRoomPrice);
                      
                      setNewInvoice({ 
                        ...newInvoice, 
                        tenant: value,
                        room: roomId || '',
                        roomPrice: actualRoomPrice
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn người thuê" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.filter(t => t.room).map(tenant => (
                        <SelectItem key={tenant._id} value={tenant._id}>
                          {tenant.fullName} - Phòng {tenant.room?.roomNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month">Tháng *</Label>
                  <Input
                    id="month"
                    type="month"
                    value={newInvoice.month || ''}
                    onChange={(e) => setNewInvoice({ ...newInvoice, month: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomPrice">Tiền phòng (VNĐ) *</Label>
                  <Input
                    id="roomPrice"
                    type="number"
                    value={newInvoice.roomPrice || ''}
                    onChange={(e) => setNewInvoice({ ...newInvoice, roomPrice: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Hạn thanh toán *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newInvoice.dueDate || ''}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="electricUsage">Số điện (kWh)</Label>
                  <Input
                    id="electricUsage"
                    type="number"
                    step="0.01"
                    value={newInvoice.electricUsage || ''}
                    onChange={(e) => setNewInvoice({ ...newInvoice, electricUsage: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="electricPrice">Giá điện (VNĐ/kWh)</Label>
                  <Input
                    id="electricPrice"
                    type="number"
                    step="0.01"
                    value={newInvoice.electricPrice || ''}
                    onChange={(e) => setNewInvoice({ ...newInvoice, electricPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waterUsage">Số nước (m³)</Label>
                  <Input
                    id="waterUsage"
                    type="number"
                    step="0.01"
                    value={newInvoice.waterUsage || ''}
                    onChange={(e) => setNewInvoice({ ...newInvoice, waterUsage: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waterPrice">Giá nước (VNĐ/m³)</Label>
                  <Input
                    id="waterPrice"
                    type="number"
                    step="0.01"
                    value={newInvoice.waterPrice || ''}
                    onChange={(e) => setNewInvoice({ ...newInvoice, waterPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Tổng tiền dự kiến:</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    (newInvoice.roomPrice || 0) +
                    (newInvoice.electricUsage || 0) * (newInvoice.electricPrice || 0) +
                    (newInvoice.waterUsage || 0) * (newInvoice.waterPrice || 0)
                  )}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsCreateOpen(false);
                  setNewInvoice(null);
                }}>
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-300 font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo Hóa Đơn
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}