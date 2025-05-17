import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { backendUrl, formatCurrency } from '../App';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SalesReport = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [viewMode, setViewMode] = useState('day'); // 'day', 'month', 'year'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });

  // Fetch orders từ backend
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
        filterOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Lọc orders theo mode và thời gian đã chọn
  const filterOrders = (orderList = orders) => {
    let filtered = [];
    
    switch (viewMode) {
      case 'day':
        filtered = orderList.filter(order => {
          const orderDate = new Date(order.date);
          return orderDate >= dateRange.startDate && orderDate <= dateRange.endDate;
        });
        break;
        
      case 'month':
        filtered = orderList.filter(order => {
          const orderDate = new Date(order.date);
          return orderDate.getMonth() + 1 === selectedMonth && 
                 orderDate.getFullYear() === selectedYear;
        });
        break;
        
      case 'year':
        filtered = orderList.filter(order => {
          const orderDate = new Date(order.date);
          return orderDate.getFullYear() === selectedYear;
        });
        break;
    }
    
    setFilteredOrders(filtered);
  };

  // Chuẩn bị dữ liệu cho biểu đồ theo mode
  const prepareChartData = () => {
    const data = {};
    
    filteredOrders.forEach(order => {
      let key;
      const orderDate = new Date(order.date);
      
      switch (viewMode) {
        case 'day':
          key = orderDate.toLocaleDateString();
          break;
        case 'month':
          key = `Ngày ${orderDate.getDate()}`;
          break;
        case 'year':
          key = `Tháng ${orderDate.getMonth() + 1}`;
          break;
      }
      
      if (!data[key]) {
        data[key] = {
          label: key,
          revenue: 0,
          orders: 0
        };
      }
      data[key].revenue += order.amount;
      data[key].orders += 1;
    });
    
    return Object.values(data).sort((a, b) => {
      if (viewMode === 'year') {
        return parseInt(a.label.split(' ')[1]) - parseInt(b.label.split(' ')[1]);
      }
      return 0;
    });
  };

  // Tính toán thống kê
  const calculateStats = () => {
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    const paidOrders = filteredOrders.filter(order => order.payment);
    const pendingOrders = filteredOrders.filter(order => !order.payment);
    
    return {
      totalOrders: filteredOrders.length,
      totalAmount,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      averageOrderValue: totalAmount / (filteredOrders.length || 1)
    };
  };

  // Xuất báo cáo Excel
  const exportToExcel = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Báo cáo doanh thu');
  
    // Định dạng cột với AutoFit
    worksheet.columns = [
      { width: 8, outlineLevel: 1 },      // STT
      { width: 18, outlineLevel: 1 },     // Ngày đặt
      { width: 35, outlineLevel: 1 },     // Khách hàng
      { width: 18, outlineLevel: 1 },     // Số điện thoại
      { width: 25, outlineLevel: 1 },     // Tổng tiền
      { width: 22, outlineLevel: 1 },     // Trạng thái
    ];
  
    // Style cho tiêu đề chính
    const titleStyle = {
      font: { bold: true, size: 18, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E79' }  // Màu xanh đậm
      },
      border: {
        top: { style: 'medium', color: { argb: '000000' } },
        left: { style: 'medium', color: { argb: '000000' } },
        bottom: { style: 'medium', color: { argb: '000000' } },
        right: { style: 'medium', color: { argb: '000000' } }
      }
    };
  
    // Style cho thời gian
    const timeStyle = {
      font: { bold: true, size: 12, color: { argb: '000000' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' }  // Màu xanh nhạt
      }
    };
  
    // Style cho thống kê
    const statsLabelStyle = {
      font: { bold: true, size: 11 },
      alignment: { horizontal: 'left', vertical: 'middle' },  // Đổi thành căn trái
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2EFDA' }  // Màu xanh lá nhạt
      }
    };
  
    const statsValueStyle = {
      font: { bold: true, size: 11, color: { argb: 'FF0066CC' } },
      alignment: { horizontal: 'left', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2EFDA' }
      }
    };
    // Style cho header bảng
    const headerStyle = {
      font: { bold: true, size: 12, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      },
      border: {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' }
      }
    };
  
    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'BÁO CÁO DOANH THU';
    Object.assign(titleCell, titleStyle);
    worksheet.getRow(1).height = 35;
  
    // Thời gian báo cáo
    worksheet.mergeCells('A2:F2');
    let timeRange = '';
    switch (viewMode) {
      case 'day':
        timeRange = `Từ ${dateRange.startDate.toLocaleDateString()} đến ${dateRange.endDate.toLocaleDateString()}`;
        break;
      case 'month':
        timeRange = `Tháng ${selectedMonth}/${selectedYear}`;
        break;
      case 'year':
        timeRange = `Năm ${selectedYear}`;
        break;
    }
    const timeCell = worksheet.getCell('A2');
    timeCell.value = timeRange;
    Object.assign(timeCell, timeStyle);
    worksheet.getRow(2).height = 25;
  
    // Thêm khoảng trống
    worksheet.addRow(['']);
  
    // Thống kê - Điều chỉnh cách hiển thị
    const stats = calculateStats();
    const statsRows = [
      { label: 'Tổng số đơn hàng:', value: stats.totalOrders },
      { label: 'Tổng doanh thu:', value: formatCurrency(stats.totalAmount) },
      { label: 'Đơn hàng đã thanh toán:', value: stats.paidOrders },
      { label: 'Đơn hàng chưa thanh toán:', value: stats.pendingOrders },
      { label: 'Giá trị trung bình/đơn:', value: formatCurrency(stats.averageOrderValue) }
    ];
  
    // Thêm thống kê với merge cells
    statsRows.forEach((stat, index) => {
      const rowNumber = worksheet.rowCount + 1;
      const row = worksheet.addRow(['', '', '', '', '', '']);
      
      // Merge 3 ô đầu cho nhãn
      worksheet.mergeCells(`A${rowNumber}:C${rowNumber}`);
      const labelCell = worksheet.getCell(`A${rowNumber}`);
      labelCell.value = stat.label;
      Object.assign(labelCell, statsLabelStyle);
      
      // Merge 3 ô sau cho giá trị
      worksheet.mergeCells(`D${rowNumber}:F${rowNumber}`);
      const valueCell = worksheet.getCell(`D${rowNumber}`);
      valueCell.value = stat.value;
      Object.assign(valueCell, statsValueStyle);
    });
  
    // Thêm khoảng trống
    worksheet.addRow(['']);
  
  
   // Headers của bảng chi tiết
   const headers = ['STT', 'Ngày đặt', 'Khách hàng', 'Số điện thoại', 'Tổng tiền', 'Trạng thái thanh toán'];
   const headerRow = worksheet.addRow(headers);
   headerRow.eachCell(cell => {
     Object.assign(cell, headerStyle);
   });
   worksheet.getRow(headerRow.number).height = 30;
 
   // Dữ liệu chi tiết
   filteredOrders.forEach((order, index) => {
     const row = worksheet.addRow([
       index + 1,
       new Date(order.date).toLocaleDateString(),
       `${order.address.firstName} ${order.address.lastName}`,
       order.address.phone,
       formatCurrency(order.amount),
       order.payment ? 'Đã thanh toán' : 'Chưa thanh toán'
     ]);
 
     // Style cơ bản cho hàng
     row.height = 25;
     row.eachCell(cell => {
       cell.border = {
         top: { style: 'thin' },
         left: { style: 'thin' },
         bottom: { style: 'thin' },
         right: { style: 'thin' }
       };
     });
 
     // Căn giữa cho cột STT và trạng thái
     row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
     row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
     
     // Căn phải và làm đậm cho cột tổng tiền
     const amountCell = row.getCell(5);
     amountCell.alignment = { horizontal: 'right', vertical: 'middle' };
     amountCell.font = { bold: true, color: { argb: 'FF0066CC' } };
 
     // Style cho trạng thái thanh toán
     const statusCell = row.getCell(6);
     if (order.payment) {
       statusCell.font = { bold: true, color: { argb: 'FF008000' } };
     } else {
       statusCell.font = { bold: true, color: { argb: 'FFFF0000' } };
     }
 
     // Tô màu xen kẽ
     if (index % 2 !== 0) {
       row.eachCell(cell => {
         cell.fill = {
           type: 'pattern',
           pattern: 'solid',
           fgColor: { argb: 'FFF5F5F5' }
         };
       });
     }
   });
 
   try {
     const buffer = await workbook.xlsx.writeBuffer();
     saveAs(new Blob([buffer]), `BaoCaoDoanhThu_${timeRange.replace(/[\/\\:]/g, '')}.xlsx`);
     toast.success('Xuất báo cáo thành công!');
   } catch (error) {
     toast.error('Lỗi khi xuất báo cáo!');
   }
 };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  useEffect(() => {
    filterOrders();
  }, [viewMode, dateRange, selectedMonth, selectedYear]);

  const stats = calculateStats();
  const chartData = prepareChartData();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Báo Cáo Doanh Thu</h1>
        <button
          onClick={exportToExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Xuất Báo Cáo
        </button>
      </div>

      {/* Bộ chọn chế độ xem và thời gian */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block mb-2">Chế độ xem:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>
          </div>

          {viewMode === 'day' && (
            <>
              <div>
                <label className="block mb-2">Từ ngày:</label>
                <input
                  type="date"
                  value={dateRange.startDate.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  className="border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Đến ngày:</label>
                <input
                  type="date"
                  value={dateRange.endDate.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                  className="border p-2 rounded"
                />
              </div>
            </>
          )}

          {(viewMode === 'month' || viewMode === 'year') && (
            <div>
              <label className="block mb-2">Năm:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border p-2 rounded"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'month' && (
            <div>
              <label className="block mb-2">Tháng:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="border p-2 rounded"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>Tháng {month}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Tổng doanh thu</h3>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Đã thanh toán</h3>
          <p className="text-2xl font-bold">{stats.paidOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Chưa thanh toán</h3>
          <p className="text-2xl font-bold">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Doanh thu</h3>
          <LineChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />
          </LineChart>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Số lượng đơn hàng</h3>
          <BarChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#82ca9d" name="Số đơn" />
          </BarChart>
        </div>
      </div>
      {/* Danh sách đơn hàng */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold p-4 border-b">Danh sách đơn hàng</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Ngày</th>
                <th className="p-4 text-left">Khách hàng</th>
                <th className="p-4 text-left">Số điện thoại</th>
                <th className="p-4 text-left">Tổng tiền</th>
                <th className="p-4 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-4">{`${order.address.firstName} ${order.address.lastName}`}</td>
                  <td className="p-4">{order.address.phone}</td>
                  <td className="p-4">{formatCurrency(order.amount)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded ${order.payment ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;