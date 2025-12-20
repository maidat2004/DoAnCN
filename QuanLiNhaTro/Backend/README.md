# Backend API - Quản Lý Nhà Trọ

Backend API cho hệ thống quản lý nhà trọ được xây dựng với Node.js, Express và MongoDB.

## 🚀 Tính năng

- ✅ Authentication (Đăng ký, Đăng nhập, JWT)
- 📋 Quản lý phòng trọ (CRUD)
- 👥 Quản lý người thuê (CRUD)
- 📄 Quản lý hợp đồng (CRUD)
- 💰 Quản lý hóa đơn (CRUD)
- 🛠 Quản lý dịch vụ (Điện, nước, internet...)
- 📝 Quản lý yêu cầu/khiếu nại từ người thuê
- 🔐 Phân quyền Admin/Student

## 📦 Cài đặt

### Yêu cầu

- Node.js >= 16.x
- MongoDB >= 5.x

### Các bước cài đặt

1. Di chuyển vào thư mục Backend:
```bash
cd Backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:
```bash
copy .env.example .env
```

4. Cấu hình file `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/quanlinhatro
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@nhatro.com
ADMIN_PASSWORD=admin123
```

5. Chạy seed data (tạo dữ liệu mẫu):
```bash
npm run seed
```

6. Chạy server:
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/profile` - Cập nhật profile
- `PUT /api/auth/change-password` - Đổi mật khẩu

### Users (Admin only)
- `GET /api/users` - Lấy danh sách users
- `GET /api/users/:id` - Lấy thông tin user
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

### Rooms
- `GET /api/rooms` - Lấy danh sách phòng
- `GET /api/rooms/available` - Lấy danh sách phòng trống
- `GET /api/rooms/:id` - Lấy thông tin phòng
- `POST /api/rooms` - Tạo phòng mới (Admin)
- `PUT /api/rooms/:id` - Cập nhật phòng (Admin)
- `DELETE /api/rooms/:id` - Xóa phòng (Admin)

### Tenants (Admin only)
- `GET /api/tenants` - Lấy danh sách người thuê
- `GET /api/tenants/:id` - Lấy thông tin người thuê
- `GET /api/tenants/user/:userId` - Lấy thông tin người thuê theo user ID
- `POST /api/tenants` - Tạo người thuê mới
- `PUT /api/tenants/:id` - Cập nhật người thuê
- `DELETE /api/tenants/:id` - Xóa người thuê

### Contracts
- `GET /api/contracts` - Lấy danh sách hợp đồng (Admin)
- `GET /api/contracts/:id` - Lấy thông tin hợp đồng
- `GET /api/contracts/tenant/:tenantId` - Lấy hợp đồng theo tenant
- `POST /api/contracts` - Tạo hợp đồng mới (Admin)
- `PUT /api/contracts/:id` - Cập nhật hợp đồng (Admin)
- `DELETE /api/contracts/:id` - Xóa hợp đồng (Admin)

### Invoices
- `GET /api/invoices` - Lấy danh sách hóa đơn (Admin)
- `GET /api/invoices/:id` - Lấy thông tin hóa đơn
- `GET /api/invoices/tenant/:tenantId` - Lấy hóa đơn theo tenant
- `POST /api/invoices` - Tạo hóa đơn mới (Admin)
- `PUT /api/invoices/:id` - Cập nhật hóa đơn (Admin)
- `PUT /api/invoices/:id/pay` - Thanh toán hóa đơn (Admin)
- `DELETE /api/invoices/:id` - Xóa hóa đơn (Admin)

### Services
- `GET /api/services` - Lấy danh sách dịch vụ
- `GET /api/services/:id` - Lấy thông tin dịch vụ
- `POST /api/services` - Tạo dịch vụ mới (Admin)
- `PUT /api/services/:id` - Cập nhật dịch vụ (Admin)
- `DELETE /api/services/:id` - Xóa dịch vụ (Admin)

### Requests
- `GET /api/requests` - Lấy danh sách yêu cầu (Admin)
- `GET /api/requests/:id` - Lấy thông tin yêu cầu
- `GET /api/requests/tenant/:tenantId` - Lấy yêu cầu theo tenant
- `POST /api/requests` - Tạo yêu cầu mới
- `PUT /api/requests/:id` - Cập nhật yêu cầu (Admin)
- `PUT /api/requests/:id/resolve` - Xử lý yêu cầu (Admin)
- `DELETE /api/requests/:id` - Xóa yêu cầu (Admin)

## 🔐 Authentication

API sử dụng JWT (JSON Web Token) để xác thực. Sau khi đăng nhập thành công, bạn sẽ nhận được token.

Gửi token trong header của các request:
```
Authorization: Bearer <your-token>
```

## 📊 Database Models

### User
- name, email, password, role (admin/student), phone, avatar, tenantId, isActive

### Room
- roomNumber, floor, area, price, capacity, status, description, amenities, images, currentTenants

### Tenant
- user, fullName, idCard, phone, email, dateOfBirth, hometown, currentAddress, occupation, emergencyContact, room, moveInDate, moveOutDate, status, notes

### Contract
- contractNumber, room, tenant, startDate, endDate, monthlyRent, deposit, paymentDate, status, terms, specialConditions, signedDate

### Invoice
- invoiceNumber, room, tenant, contract, month, year, roomRent, services[], totalAmount, dueDate, paidDate, status, paymentMethod, notes

### Service
- name, type, unitPrice, unit, description, isActive

### Request
- tenant, room, type, title, description, priority, status, images, response, resolvedDate, resolvedBy

## 🧪 Testing

Bạn có thể test API bằng Postman hoặc Thunder Client.

### Thông tin đăng nhập mặc định:
- **Email**: admin@nhatro.com
- **Password**: admin123

## 📝 Notes

- Tất cả routes có prefix `/api`
- Các routes có `(Admin)` yêu cầu quyền admin
- Timestamps (createdAt, updatedAt) được tự động thêm vào tất cả models

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables

## 📄 License

MIT
