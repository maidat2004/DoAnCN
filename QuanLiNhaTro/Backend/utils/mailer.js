import nodemailer from 'nodemailer';

// Cấu hình transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

/**
 * Gửi email thông báo tài khoản mới
 * @param {string} toEmail - Email người nhận
 * @param {string} fullName - Tên người dùng
 * @param {string} password - Mật khẩu mặc định
 */
const sendAccountEmail = async (toEmail, fullName, password) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Quản Lý Nhà Trọ" <${process.env.EMAIL_USER || 'admin@gmail.com'}>`,
      to: toEmail,
      subject: '🏠 Thông tin tài khoản đăng nhập - Quản Lý Nhà Trọ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">🏠 Quản Lý Nhà Trọ</h2>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <p>Xin chào <strong>${fullName}</strong>,</p>
          
          <p>Tài khoản của bạn đã được tạo thành công trên hệ thống Quản Lý Nhà Trọ.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📧 Email đăng nhập:</strong> ${toEmail}</p>
            <p style="margin: 5px 0;"><strong>🔑 Mật khẩu mặc định:</strong> ${password}</p>
          </div>
          
          <p style="color: #dc2626; font-weight: bold;">⚠️ Vui lòng đăng nhập và đổi mật khẩu ngay lập tức để bảo mật tài khoản.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            Đây là email tự động, vui lòng không trả lời email này.<br>
            © ${new Date().getFullYear()} Quản Lý Nhà Trọ
          </p>
        </div>
      `,
      text: `
Xin chào ${fullName},

Tài khoản của bạn đã được tạo thành công.

Email đăng nhập: ${toEmail}
Mật khẩu mặc định: ${password}

Vui lòng đăng nhập và đổi mật khẩu ngay lập tức để bảo mật tài khoản.

Trân trọng,
Admin - Quản Lý Nhà Trọ
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Không throw error để không làm gián đoạn quá trình tạo tài khoản
    return { success: false, error: error.message };
  }
};

/**
 * Gửi email thông báo đổi mật khẩu thành công
 */
const sendPasswordChangedEmail = async (toEmail, fullName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Quản Lý Nhà Trọ" <${process.env.EMAIL_USER || 'admin@gmail.com'}>`,
      to: toEmail,
      subject: '🔒 Mật khẩu đã được thay đổi - Quản Lý Nhà Trọ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">🏠 Quản Lý Nhà Trọ</h2>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <p>Xin chào <strong>${fullName}</strong>,</p>
          
          <p>Mật khẩu tài khoản của bạn đã được thay đổi thành công.</p>
          
          <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ admin ngay lập tức.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Quản Lý Nhà Trọ
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Không throw error để không làm gián đoạn quá trình tạo tài khoản
    return { success: false, error: error.message };
  }
};

/**
 * Gửi email thông báo hóa đơn thanh toán
 * @param {string} toEmail - Email người nhận
 * @param {string} fullName - Tên người thuê
 * @param {Object} invoiceData - Thông tin hóa đơn
 */
const sendInvoiceEmail = async (toEmail, fullName, invoiceData) => {
  try {
    const transporter = createTransporter();

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('vi-VN');
    };

    const mailOptions = {
      from: `"Quản Lý Nhà Trọ" <${process.env.EMAIL_USER || 'admin@gmail.com'}>`,
      to: toEmail,
      subject: `💰 Hóa đơn thanh toán ${invoiceData.month}/${invoiceData.year} - Quản Lý Nhà Trọ`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">🏠 Quản Lý Nhà Trọ</h2>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <p>Xin chào <strong>${fullName}</strong>,</p>
          
          <p>Hóa đơn thanh toán cho phòng <strong>${invoiceData.room?.roomNumber || 'N/A'}</strong> tháng <strong>${invoiceData.month}/${invoiceData.year}</strong> đã được tạo.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">📋 Chi tiết hóa đơn:</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                ${invoiceData.services && invoiceData.services.length > 0 ? 
                  invoiceData.services.map(service => `
                    <tr>
                      <td style="padding: 5px 0; border-bottom: 1px solid #e5e7eb;">
                        ${service.service?.name || 'Dịch vụ'} (${service.quantity} ${service.service?.unit || 'đơn vị'})
                      </td>
                      <td style="padding: 5px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">
                        ${formatCurrency(service.amount)}
                      </td>
                    </tr>
                  `).join('') : ''
                }
                <tr style="font-weight: bold; background-color: #e5e7eb;">
                  <td style="padding: 10px 0;">Tổng cộng</td>
                  <td style="padding: 10px 0; text-align: right;">${formatCurrency(invoiceData.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>⏰ Hạn thanh toán:</strong> ${formatDate(invoiceData.dueDate)}<br>
              <strong>💳 Phương thức thanh toán:</strong> Tiền mặt hoặc chuyển khoản
            </p>
          </div>
          
          <p>Vui lòng thanh toán đúng hạn để tránh phí phạt. Bạn có thể xem chi tiết hóa đơn và thanh toán trực tuyến trên hệ thống.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              🏠 Đăng nhập để xem hóa đơn
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            Đây là email tự động, vui lòng không trả lời email này.<br>
            Nếu có thắc mắc, vui lòng liên hệ admin qua số điện thoại hoặc email.<br>
            © ${new Date().getFullYear()} Quản Lý Nhà Trọ
          </p>
        </div>
      `,
      text: `
Xin chào ${fullName},

Hóa đơn thanh toán cho phòng ${invoiceData.room?.roomNumber || 'N/A'} tháng ${invoiceData.month}/${invoiceData.year} đã được tạo.

Chi tiết hóa đơn:
${invoiceData.services && invoiceData.services.length > 0 ? 
  invoiceData.services.map(service => 
    `- ${service.service?.name || 'Dịch vụ'}: ${formatCurrency(service.amount)}`
  ).join('\n') : ''
}

Tổng cộng: ${formatCurrency(invoiceData.totalAmount)}
Hạn thanh toán: ${formatDate(invoiceData.dueDate)}

Vui lòng thanh toán đúng hạn để tránh phí phạt.

Trân trọng,
Admin - Quản Lý Nhà Trọ
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Invoice email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending invoice email:', error);
    return { success: false, error: error.message };
  }
};

export { sendAccountEmail, sendPasswordChangedEmail, sendInvoiceEmail };
