import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { backendUrl, currency, formatCurrency } from '../App';
import { assets } from '../assets/assets';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';

const removeVietnameseTones = (str) => {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from backend
  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update order status
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Export invoice as PDF
  const exportInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFont('Arial', 'bold');
    doc.setFontSize(12);
    doc.text('FOREVER', 105, 30, null, null, 'center');
    doc.text('Thanh pho Tay Ninh, Tay Ninh', 105, 40, null, null, 'center');
    doc.text('LH: 0389636525', 105, 50, null, null, 'center');

    doc.setFontSize(16);
    doc.text('HOA DON THANH TOAN', 105, 65, null, null, 'center');
    doc.setFontSize(12);

    let yPosition = 75;
    const lineHeight = 10;

    doc.setFont('Arial', 'bold');
    doc.text('Khach hang:', 20, yPosition);
    doc.setFont('Arial', 'normal');
    doc.text(
      removeVietnameseTones(`${order.address.firstName} ${order.address.lastName}`),
      50,
      yPosition
    );
    yPosition += lineHeight;

    doc.setFont('Arial', 'bold');
    doc.text('Dia chi:', 20, yPosition);
    doc.setFont('Arial', 'normal');
    const addressText = removeVietnameseTones(
      `${order.address.street}, ${order.address.state}, ${order.address.city}, ${order.address.country}`
    );
    const addressLines = doc.splitTextToSize(addressText, 150);
    doc.text(addressLines, 50, yPosition);
    yPosition += addressLines.length * lineHeight;

    doc.setFont('Arial', 'bold');
    doc.text('So dien thoai:', 20, yPosition);
    doc.setFont('Arial', 'normal');
    doc.text(removeVietnameseTones(`${order.address.phone}`), 50, yPosition);
    yPosition += lineHeight;

    doc.setFont('Arial', 'bold');
    doc.text('Danh sach san pham:', 20, yPosition);
    yPosition += lineHeight;

    order.items.forEach((item) => {
      doc.setFont('Arial', 'normal');
      doc.text(
        removeVietnameseTones(`${item.name} x ${item.quantity}`),
        30,
        yPosition
      );
      yPosition += lineHeight;
    });

    doc.setFont('Arial', 'bold');
    doc.text('Tong tien:', 20, yPosition);
    doc.setFont('Arial', 'normal');
    doc.text(removeVietnameseTones(formatCurrency(order.amount)), 50, yPosition);
    yPosition += lineHeight;

    doc.setFont('Arial', 'bold');
    doc.text('Phuong thuc thanh toan:', 20, yPosition);
    doc.setFont('Arial', 'normal');
    doc.text(removeVietnameseTones(`${order.paymentMethod}`), 70, yPosition);
    yPosition += lineHeight;

    doc.setFont('Arial', 'bold');
    doc.text('Trang thai thanh toan:', 20, yPosition);
    doc.setFont('Arial', 'normal');
    const paymentStatus = order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán';
    doc.text(removeVietnameseTones(paymentStatus), 70, yPosition);
    yPosition += lineHeight;

    doc.setFont('Arial', 'bold');
    doc.text('Trang thai:', 20, yPosition);
    doc.setFont('Arial', 'normal');
    doc.text(removeVietnameseTones(`${order.status}`), 50, yPosition);

    doc.save(`HoaDon_${order._id}.pdf`);
  };

  // Export orders to Excel
 const exportToExcel = async () => {
    const shopName = 'Forever';
    const exportDate = new Date().toLocaleString('vi-VN');
  
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Danh Sách Đơn Hàng');
  
    // Tiêu đề chính
    worksheet.mergeCells('A1:E1');
    const titleRow = worksheet.getCell('A1');
    titleRow.value = 'DANH SÁCH ĐƠN HÀNG';
    titleRow.font = { name: 'Arial', size: 18, bold: true };
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 35;
  
    // Thông tin cửa hàng
    worksheet.mergeCells('A3:E3');
    const shopInfoRow = worksheet.getCell('A3');
    shopInfoRow.value = `Cửa hàng: ${shopName}`;
    shopInfoRow.font = { name: 'Arial', size: 12, bold: true };
    shopInfoRow.alignment = { horizontal: 'left', vertical: 'middle' };
  
    // Ngày xuất
    worksheet.mergeCells('A4:E4');
    const dateInfoRow = worksheet.getCell('A4');
    dateInfoRow.value = `Ngày xuất: ${exportDate}`;
    dateInfoRow.font = { name: 'Arial', size: 12, bold: true };
    dateInfoRow.alignment = { horizontal: 'left', vertical: 'middle' };
  
  
    // Header
    const headers = [
      'STT',
      'Họ và Tên',
      'Số Điện Thoại',
      'Địa Chỉ',
      'Phương Thức Thanh Toán',
      'Thanh Toán',
      'Tổng Tiền',
      'Trạng Thái',
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 30;
  
    // Định dạng header
    headerRow.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4472C4' } };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });
  
    // Thiết lập độ rộng cột
    worksheet.columns = [
      { key: 'stt', width: 8 },
      { key: 'name', width: 25 },
      { key: 'phone', width: 15 },
      { key: 'address', width: 40 },
      { key: 'paymentMethod', width: 25 },
      { key: 'payment', width: 18 },
      { key: 'total', width: 15 },
      { key: 'status', width: 20 },
    ];
  
    // Dữ liệu
    let totalOrders = 0;
    let totalAmount = 0;
  
    orders.forEach((order, index) => {
      const row = worksheet.addRow({
        stt: index + 1,
        name: `${order.address.firstName} ${order.address.lastName}`,
        phone: order.address.phone,
        address: `${order.address.street}, ${order.address.state}, ${order.address.city}, ${order.address.country}`,
        paymentMethod: order.paymentMethod,
        payment: order.payment ? 'Đã thanh toán' : 'Chưa thanh toán',
        total: formatCurrency(order.amount),
        status: order.status,
      });
  
      // Cộng tổng đơn hàng và tổng tiền
      totalOrders++;
      totalAmount += order.amount;
  
      row.eachCell((cell, colIndex) => {
        cell.font = { name: 'Arial', size: 11 };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
  
        // Căn chỉnh và ngắt dòng
        if (colIndex === 1) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' }; // STT
        } else if (colIndex === 6 || colIndex === 7) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' }; // Tổng Tiền và Thanh Toán
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true }; // Các cột còn lại
        }
      });
  
      // Tự động điều chỉnh chiều cao dòng
      row.height = Math.max(22, row.getCell(4).value?.length / 20 + 15); // Chiều cao linh hoạt cho Địa Chỉ
    });
  
    // Footer - Tổng số đơn hàng và tổng số tiền
    worksheet.mergeCells(`A${worksheet.lastRow.number + 1}:E${worksheet.lastRow.number + 1}`);
    const totalOrderCell = worksheet.getCell(`A${worksheet.lastRow.number}`);
    totalOrderCell.value = `Tổng số đơn hàng: ${totalOrders}`;
    totalOrderCell.font = { name: 'Arial', size: 12, bold: true };
    totalOrderCell.alignment = { horizontal: 'left', vertical: 'middle' };
  
    worksheet.mergeCells(`F${worksheet.lastRow.number}:H${worksheet.lastRow.number}`);
    const totalAmountCell = worksheet.getCell(`F${worksheet.lastRow.number}`);
    totalAmountCell.value = `Tổng số tiền: ${formatCurrency(totalAmount)}`;
    totalAmountCell.font = { name: 'Arial', size: 12, bold: true };
    totalAmountCell.alignment = { horizontal: 'right', vertical: 'middle' };
  
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), 'DanhSachDonHang.xlsx');
      toast.success('Xuất file Excel thành công!');
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      toast.error('Lỗi khi xuất file Excel!');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <p className="text-2xl font-bold mb-4">Danh Sách Đơn Hàng</p>
      <button
        onClick={exportToExcel}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md mb-4 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Xuất File Excel
      </button>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào</p>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
              key={index}
            >
              <img className="w-12" src={assets.parcel_icon} alt="" />
              <div>
                {order.items.map((item, idx) => (
                  <p className="py-0.5" key={idx}>
                    {item.name} x {item.quantity}
                  </p>
                ))}
                <p className="mt-3 mb-2 font-medium">
                  {order.address.firstName + ' ' + order.address.lastName}
                </p>
                <div>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.state + ', ' + order.address.city + ', ' + order.address.country}
                  </p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p>Số lượng sản phẩm: {order.items.length}</p>
                <p>Phương thức thanh toán: {order.paymentMethod}</p>
                <p>Thanh toán: {order.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                <p>Ngày: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p>{formatCurrency(order.amount)}</p> {/* Updated to use formatCurrency */}

              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-2 font-semibold">
                <option value="Đơn hàng đã đặt">Đơn hàng đã đặt</option>
                <option value="Đang đóng gói">Đang đóng gói</option>
                <option value="Đã gửi">Đã gửi</option>
                <option value="Đang giao hàng">Đang giao hàng</option>
                <option value="Đã giao">Đã giao</option>
              </select>
              <button
                onClick={() => exportInvoice(order)}
                className="text-blue-500 font-semibold mt-3">
                Xuất Hóa Đơn
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
