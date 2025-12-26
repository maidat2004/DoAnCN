import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar,
  FileText,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { requestService } from '../../services/requestService';
import { toast } from 'sonner';

export default function RequestManagement() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getRequests();
      setRequests(data);
    } catch (error) {
      toast.error('Không thể tải danh sách yêu cầu');
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      console.log('Approving request:', requestId, 'with note:', reviewNote);
      await requestService.updateRequestStatus(requestId, 'resolved', reviewNote);
      toast.success('Yêu cầu đã được duyệt và xử lý');

      // Update local state immediately for better UX
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === requestId
            ? { ...req, status: 'resolved', reviewNote, reviewDate: new Date().toISOString() }
            : req
        )
      );

      // Also update selectedRequest if it's the same
      if (selectedRequest && selectedRequest._id === requestId) {
        setSelectedRequest(prev => ({
          ...prev,
          status: 'resolved',
          reviewNote,
          reviewDate: new Date().toISOString()
        }));
      }

      setSelectedRequest(null);
      setReviewNote('');
      await loadRequests();
    } catch (error) {
      toast.error('Không thể duyệt yêu cầu');
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      console.log('Rejecting request:', requestId, 'with note:', reviewNote);
      await requestService.updateRequestStatus(requestId, 'rejected', reviewNote);
      toast.success('Yêu cầu đã bị từ chối');

      // Update local state immediately for better UX
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === requestId
            ? { ...req, status: 'rejected', reviewNote, reviewDate: new Date().toISOString() }
            : req
        )
      );

      // Also update selectedRequest if it's the same
      if (selectedRequest && selectedRequest._id === requestId) {
        setSelectedRequest(prev => ({
          ...prev,
          status: 'rejected',
          reviewNote,
          reviewDate: new Date().toISOString()
        }));
      }

      setSelectedRequest(null);
      setReviewNote('');
      await loadRequests();
    } catch (error) {
      toast.error('Không thể từ chối yêu cầu');
      console.error('Error rejecting request:', error);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Chờ duyệt</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300"><ArrowRight className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Đã xử lý</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><XCircle className="w-3 h-3 mr-1" />Từ chối</Badge>;
      default:
        return null;
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    resolved: requests.filter(r => r.status === 'resolved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-3xl">📋</span>
          </div>
          <div>
            <h1 className="text-3xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Quản Lý Yêu Cầu
            </h1>
            <p className="text-gray-600">Xử lý yêu cầu cập nhật thông tin từ sinh viên</p>
          </div>
        </div>
        <Button
          onClick={loadRequests}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card 
            className={`cursor-pointer transition-all duration-200 border-2 ${
              filter === 'all' ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setFilter('all')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng yêu cầu</p>
                  <p className="text-2xl text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            className={`cursor-pointer transition-all duration-200 border-2 ${
              filter === 'pending' ? 'border-yellow-500 shadow-lg' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setFilter('pending')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chờ duyệt</p>
                  <p className="text-2xl text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card 
            className={`cursor-pointer transition-all duration-200 border-2 ${
              filter === 'approved' ? 'border-green-500 shadow-lg' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setFilter('approved')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đã duyệt</p>
                  <p className="text-2xl text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card 
            className={`cursor-pointer transition-all duration-200 border-2 ${
              filter === 'rejected' ? 'border-red-500 shadow-lg' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setFilter('rejected')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Từ chối</p>
                  <p className="text-2xl text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Requests List */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Danh Sách Yêu Cầu</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500">Không có yêu cầu nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white">{request.tenant?.fullName?.charAt(0) || 'N'}</span>
                        </div>
                        <div>
                          <h3 className="text-gray-900">{request.tenant?.fullName || 'N/A'}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(request.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-13">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {request.type || 'Yêu cầu'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {request.priority || 'Bình thường'}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{request.title}</p>
                        {request.description && (
                          <p className="text-sm text-gray-600 line-clamp-1">
                            <MessageSquare className="w-3 h-3 inline mr-1" />
                            {request.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(request.status)}
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      <Dialog open={selectedRequest !== null} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  Chi Tiết Yêu Cầu
                </DialogTitle>
                <DialogDescription>
                  Xem xét và xử lý yêu cầu cập nhật thông tin
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* User Info */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">{selectedRequest.tenant?.fullName?.charAt(0) || 'N'}</span>
                    </div>
                    <div>
                      <h3 className="text-gray-900">{selectedRequest.tenant?.fullName || 'N/A'}</h3>
                      <p className="text-sm text-gray-600">
                        Ngày gửi: {new Date(selectedRequest.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>

                {/* Request Info */}
                <div>
                  <h4 className="text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Thông Tin Yêu Cầu
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Tiêu đề:</p>
                      <p className="text-gray-900 font-semibold">{selectedRequest.title}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Loại yêu cầu:</p>
                      <Badge variant="outline">{selectedRequest.type || 'Yêu cầu'}</Badge>
                      <Badge variant="outline" className="ml-2">{selectedRequest.priority || 'Bình thường'}</Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedRequest.description && (
                  <div>
                    <h4 className="text-gray-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      Mô tả chi tiết
                    </h4>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedRequest.description}</p>
                    </div>
                  </div>
                )}

                {/* Review section */}
                {selectedRequest.status === 'pending' ? (
                  <div>
                    <h4 className="text-gray-900 mb-2">Ghi Chú Phản Hồi (tùy chọn)</h4>
                    <Textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Nhập ghi chú phản hồi cho sinh viên..."
                      rows={3}
                      className="mb-4"
                    />
                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(null);
                          setReviewNote('');
                        }}
                      >
                        Đóng
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleReject(selectedRequest._id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Từ Chối
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                        onClick={() => handleApprove(selectedRequest._id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Phê Duyệt
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-gray-900 mb-2">Kết Quả Xử Lý</h4>
                    <div className={`p-4 rounded-lg border ${
                      selectedRequest.status === 'approved' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {selectedRequest.status === 'approved' ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-800">Đã phê duyệt</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-800">Đã từ chối</span>
                          </>
                        )}
                      </div>
                      {selectedRequest.reviewDate && (
                        <p className="text-sm text-gray-600 mb-2">
                          Ngày xử lý: {new Date(selectedRequest.reviewDate).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                      {selectedRequest.reviewNote && (
                        <p className="text-gray-700">{selectedRequest.reviewNote}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
