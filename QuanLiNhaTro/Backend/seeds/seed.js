import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Service from '../models/Service.js';
import Tenant from '../models/Tenant.js';
import Contract from '../models/Contract.js';
import Invoice from '../models/Invoice.js';
import Request from '../models/Request.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Room.deleteMany(),
      Service.deleteMany(),
      Tenant.deleteMany(),
      Contract.deleteMany(),
      Invoice.deleteMany(),
      Request.deleteMany()
    ]);

    console.log('📝 Đã xóa dữ liệu cũ');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@nhatro.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      phone: '0123456789'
    });

    console.log('✅ Đã tạo tài khoản Admin');

    // Create Sample User
    const user = await User.create({
      name: 'Nguyễn Văn A',
      email: 'user@nhatro.com',
      password: 'user123',
      role: 'user',
      phone: '0987654321'
    });

    console.log('✅ Đã tạo tài khoản User');

    // Create Sample Rooms
    const rooms = await Room.insertMany([
      {
        roomNumber: 'P101',
        floor: 1,
        area: 25,
        price: 2500000,
        capacity: 2,
        status: 'available',
        description: 'Phòng đầy đủ tiện nghi, gần trường đại học',
        amenities: ['Điều hòa', 'Nóng lạnh', 'Giường', 'Tủ quần áo', 'WiFi'],
        images: []
      },
      {
        roomNumber: 'P102',
        floor: 1,
        area: 20,
        price: 2000000,
        capacity: 1,
        status: 'available',
        description: 'Phòng nhỏ, phù hợp cho 1 người',
        amenities: ['Điều hòa', 'Nóng lạnh', 'Giường', 'WiFi'],
        images: []
      },
      {
        roomNumber: 'P201',
        floor: 2,
        area: 30,
        price: 3000000,
        capacity: 3,
        status: 'available',
        description: 'Phòng rộng rãi, view đẹp',
        amenities: ['Điều hòa', 'Nóng lạnh', 'Giường đôi', 'Tủ quần áo', 'Ban công', 'WiFi'],
        images: []
      },
      {
        roomNumber: 'P202',
        floor: 2,
        area: 25,
        price: 2500000,
        capacity: 2,
        status: 'occupied',
        description: 'Phòng đang cho thuê',
        amenities: ['Điều hòa', 'Nóng lạnh', 'Giường', 'Tủ quần áo', 'WiFi'],
        images: []
      },
      {
        roomNumber: 'P301',
        floor: 3,
        area: 28,
        price: 2800000,
        capacity: 2,
        status: 'available',
        description: 'Phòng tầng cao, thoáng mát',
        amenities: ['Điều hòa', 'Nóng lạnh', 'Giường', 'Tủ quần áo', 'Ban công', 'WiFi'],
        images: []
      }
    ]);

    console.log('✅ Đã tạo 5 phòng mẫu');

    // Create Sample Services
    const services = await Service.insertMany([
      {
        name: 'Tiền điện',
        type: 'electricity',
        unitPrice: 3500,
        unit: 'kWh',
        description: 'Giá điện theo công tơ',
        isActive: true
      },
      {
        name: 'Tiền nước',
        type: 'water',
        unitPrice: 20000,
        unit: 'm³',
        description: 'Giá nước theo công tơ',
        isActive: true
      },
      {
        name: 'Internet',
        type: 'internet',
        unitPrice: 100000,
        unit: 'tháng',
        description: 'Cáp quang 100Mbps',
        isActive: true
      },
      {
        name: 'Gửi xe máy',
        type: 'parking',
        unitPrice: 50000,
        unit: 'xe/tháng',
        description: 'Phí gửi xe máy',
        isActive: true
      },
      {
        name: 'Dọn phòng',
        type: 'cleaning',
        unitPrice: 100000,
        unit: 'lần',
        description: 'Dịch vụ dọn phòng',
        isActive: true
      }
    ]);

    console.log('✅ Đã tạo 5 dịch vụ mẫu');

    // Create Tenant linked to User and a room (occupied)
    const tenant = await Tenant.create({
      user: user._id,
      fullName: 'Nguyễn Văn A',
      idCard: '012345678901',
      phone: '0987654321',
      email: 'user@nhatro.com',
      dateOfBirth: new Date('1998-05-10'),
      hometown: 'Hà Nội',
      currentAddress: '123 Đường ABC, Quận 1, TP.HCM',
      occupation: 'Nhân viên văn phòng',
      emergencyContact: {
        name: 'Nguyễn Văn B',
        phone: '0912345678',
        relationship: 'Anh trai'
      },
      room: rooms[3]._id,
      moveInDate: new Date('2024-09-01'),
      status: 'active',
      notes: 'Khách thuê mẫu'
    });

    console.log('✅ Đã tạo Tenant mẫu');

    // Update room occupancy
    await Room.findByIdAndUpdate(rooms[3]._id, {
      status: 'occupied',
      currentTenants: [tenant._id]
    });

    console.log('🔄 Đã cập nhật trạng thái phòng và người thuê');

    // Create Contract for tenant
    const contract = await Contract.create({
      contractNumber: 'HD-2024-001',
      room: rooms[3]._id,
      tenant: tenant._id,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-08-31'),
      monthlyRent: rooms[3].price,
      deposit: 5000000,
      paymentDate: 5,
      status: 'active',
      terms: 'Thanh toán vào ngày 5 hàng tháng.',
      specialConditions: 'Không nuôi thú cưng.'
    });

    console.log('✅ Đã tạo Hợp đồng mẫu');

    // Create Invoice sample for November 2024
    const invoice = await Invoice.create({
      invoiceNumber: 'INV-2024-11-001',
      room: rooms[3]._id,
      tenant: tenant._id,
      contract: contract._id,
      month: 11,
      year: 2024,
      roomRent: rooms[3].price,
      services: [
        {
          service: services[0]._id,
          name: services[0].name,
          oldReading: 100,
          newReading: 120,
          unitPrice: services[0].unitPrice,
          amount: 20 * services[0].unitPrice
        },
        {
          service: services[1]._id,
          name: services[1].name,
          oldReading: 10,
          newReading: 12,
          unitPrice: services[1].unitPrice,
          amount: 2 * services[1].unitPrice
        },
        {
          service: services[2]._id,
          name: services[2].name,
          quantity: 1,
          unitPrice: services[2].unitPrice,
          amount: services[2].unitPrice
        },
        {
          service: services[3]._id,
          name: services[3].name,
          quantity: 1,
          unitPrice: services[3].unitPrice,
          amount: services[3].unitPrice
        }
      ],
      totalAmount: rooms[3].price + (20 * services[0].unitPrice) + (2 * services[1].unitPrice) + services[2].unitPrice + services[3].unitPrice,
      dueDate: new Date('2024-11-10'),
      status: 'pending',
      paymentMethod: 'cash',
      notes: 'Hóa đơn mẫu tháng 11/2024'
    });

    console.log('✅ Đã tạo Hóa đơn mẫu');

    // Create sample Request
    await Request.create({
      tenant: tenant._id,
      room: rooms[3]._id,
      type: 'repair',
      title: 'Sửa điều hòa phòng P202',
      description: 'Máy lạnh không mát, có tiếng ồn lạ.',
      priority: 'high',
      status: 'in-progress',
      images: [],
      response: 'Đã tiếp nhận, sẽ cử kỹ thuật viên trong ngày.',
      resolvedBy: admin._id
    });

    console.log('✅ Đã tạo Yêu cầu sửa chữa mẫu');

    console.log('\n🎉 Seed data hoàn tất!');
    console.log('\n📋 Thông tin đăng nhập:');
    console.log('\n👨‍💼 Admin:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('\n👤 User:');
    console.log(`Email: ${user.email}`);
    console.log(`Password: user123`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

seedData();
