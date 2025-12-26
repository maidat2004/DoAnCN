import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Receipt, Calendar, DollarSign, Zap, Droplet, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import { tenantService } from '../../services/tenantService';
import { toast } from 'sonner';

export default function UserInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        toast.error('Vui lòng đăng nhập');
        return;
      }

      // Get user ID with fallback
      const userId = user._id || user.id;
      console.log('UserInvoices - Loading for user ID:', userId);
      
      // Get tenant first
      const tenant = await tenantService.getTenantByUser(userId);
      console.log('UserInvoices - Tenant:', tenant);
      
      if (tenant) {
        // Get invoices by tenant
        const data = await invoiceService.getInvoicesByTenant(tenant._id);
        console.log('UserInvoices - Invoices:', data);
        setInvoices(data);
      } else {
        console.warn('UserInvoices - No tenant found');
        setInvoices([]);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách hóa đơn');
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700 border-green-300',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      unpaid: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      overdue: 'bg-red-100 text-red-700 border-red-300'
    };
    const labels = {
      paid: 'Đã thanh toán',
      pending: 'Chưa thanh toán',
      unpaid: 'Chưa thanh toán',
      overdue: 'Quá hạn'
    };
    const icons = {
      paid: CheckCircle,
      pending: Clock,
      unpaid: Clock,
      overdue: AlertCircle
    };
    const Icon = icons[status] || Clock;
    const style = styles[status] || styles.pending;
    const label = labels[status] || 'Chưa thanh toán';
    
    return (
      <Badge className={`${style} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    unpaid: invoices.filter(i => i.status === 'pending' || i.status === 'unpaid').length,
    totalAmount: invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0),
    unpaidAmount: invoices.filter(i => i.status === 'pending' || i.status === 'unpaid').reduce((sum, i) => sum + (i.totalAmount || 0), 0)
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Hóa Đơn Của Tôi</h2>
        <p className="text-gray-600">Quản lý và theo dõi các hóa đơn thanh toán</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng hóa đơn</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã thanh toán</p>
                <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chưa thanh toán</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unpaid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cần thanh toán</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.unpaidAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
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
      ) : invoices.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có hóa đơn nào</h3>
            <p className="text-gray-600">Các hóa đơn của bạn sẽ hiển thị ở đây</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice._id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetail(invoice)}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Hóa đơn tháng {invoice.month}</h3>
                          <p className="text-sm text-gray-600">Phòng {invoice.room?.roomNumber || 'N/A'}</p>
                        </div>
                      </div>
                      {getStatusBadge(invoice.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Hạn thanh toán</p>
                          <p className="text-gray-900">{new Date(invoice.dueDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Điện</p>
                          <p className="text-gray-900">
                            {(() => {
                              const electricService = invoice.services?.find(s => 
                                s.service?.name?.toLowerCase().includes('điện') || 
                                s.service?.type === 'electricity'
                              );
                              return electricService ? `${electricService.quantity || 0} kWh` : '0 kWh';
                            })()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Nước</p>
                          <p className="text-gray-900">
                            {(() => {
                              const waterService = invoice.services?.find(s => 
                                s.service?.name?.toLowerCase().includes('nước') || 
                                s.service?.type === 'water'
                              );
                              return waterService ? `${waterService.quantity || 0} m³` : '0 m³';
                            })()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-600">Tổng tiền</p>
                          <p className="text-lg font-bold text-blue-600">{formatCurrency(invoice.totalAmount)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetail(invoice);
                  }}>
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Invoice Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi Tiết Hóa Đơn</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về hóa đơn thanh toán
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Hóa đơn tháng {selectedInvoice.month}</h3>
                  <p className="text-sm text-gray-600">Phòng {selectedInvoice.room?.roomNumber || 'N/A'}</p>
                </div>
                {getStatusBadge(selectedInvoice.status)}
              </div>

              {/* Room Charges */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Chi Phí Phòng</h4>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tiền phòng:</span>
                    <span className="text-gray-900 font-semibold">{formatCurrency(selectedInvoice.roomRent || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Utilities */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Tiện Ích</h4>
                <div className="space-y-3">
                  {(() => {
                    const electricService = selectedInvoice.services?.find(s => 
                      s.service?.name?.toLowerCase().includes('điện') || 
                      s.service?.type === 'electricity'
                    );
                    const waterService = selectedInvoice.services?.find(s => 
                      s.service?.name?.toLowerCase().includes('nước') || 
                      s.service?.type === 'water'
                    );
                    
                    return (
                      <>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <Zap className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Điện</p>
                              <p className="font-semibold text-gray-900">
                                {electricService ? `${electricService.quantity || 0} kWh × ${formatCurrency(electricService.unitPrice || 0)}` : '0 kWh × 0 ₫'}
                              </p>
                            </div>
                          </div>
                          <span className="text-gray-900 font-semibold">
                            {formatCurrency(electricService?.amount || 0)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Droplet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Nước</p>
                              <p className="font-semibold text-gray-900">
                                {waterService ? `${waterService.quantity || 0} m³ × ${formatCurrency(waterService.unitPrice || 0)}` : '0 m³ × 0 ₫'}
                              </p>
                            </div>
                          </div>
                          <span className="text-gray-900 font-semibold">
                            {formatCurrency(waterService?.amount || 0)}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Additional Services */}
              {selectedInvoice.services && selectedInvoice.services.length > 2 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Dịch Vụ Khác</h4>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    {selectedInvoice.services
                      .filter(service => {
                        const name = service.service?.name?.toLowerCase() || service.name?.toLowerCase() || '';
                        return !name.includes('điện') && !name.includes('nước');
                      })
                      .map((service, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{service.service?.name || service.name}:</span>
                          <span className="text-gray-900">{formatCurrency(service.amount || 0)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Tổng cộng:</span>
                  <span className="text-3xl font-bold">{formatCurrency(selectedInvoice.totalAmount)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hạn thanh toán:</span>
                  <span className="text-gray-900 font-semibold">
                    {new Date(selectedInvoice.dueDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                {selectedInvoice.paidDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngày thanh toán:</span>
                    <span className="text-green-600 font-semibold">
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
                {selectedInvoice.status === 'unpaid' && (
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Liên Hệ Thanh Toán
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
