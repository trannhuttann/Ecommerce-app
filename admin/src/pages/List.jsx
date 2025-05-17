import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency, formatCurrency } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa nó!',
      cancelButtonText: 'Không, hủy!',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            backendUrl + '/api/product/remove',
            { id },
            { headers: { token } }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            await fetchList();
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('Hành động xóa đã bị hủy');
      }
    });
  };

  const exportToExcel = async () => {
    const shopName = 'Forever';
    const exportDate = new Date().toLocaleString('vi-VN');
  
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Danh Sách Sản Phẩm');
  
    // Tiêu đề chính
    worksheet.mergeCells('A1:E1');
    const titleRow = worksheet.getCell('A1');
    titleRow.value = 'DANH SÁCH SẢN PHẨM';
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
    const headers = ['STT', 'Tên Sản Phẩm', 'Danh Mục', 'Giá', 'Link Hình Ảnh'];
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
      { key: 'name', width: 50 }, // Tăng thêm độ rộng
      { key: 'category', width: 20 },
      { key: 'price', width: 15 },
      { key: 'image', width: 60 }, // Tăng thêm độ rộng
    ];
  
    // Dữ liệu
    list.forEach((item, index) => {
      const row = worksheet.addRow({
        stt: index + 1,
        name: item.name,
        category: item.category,
        price: formatCurrency(item.price),
        image: item.image[0],
      });
  
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
        } else if (colIndex === 4) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' }; // Giá
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true }; // Ngắt dòng
        }
      });
  
      // Tự động điều chỉnh chiều cao dòng dựa trên nội dung
      row.height = Math.max(22, row.getCell(2).value?.length / 20 + 15); // Chiều cao linh hoạt
    });
  
    // Footer
    const footerRow = worksheet.addRow(['']);
    worksheet.mergeCells(`A${footerRow.number}:E${footerRow.number}`);
    const footer = worksheet.getCell(`A${footerRow.number}`);
    footer.value = `Tổng số sản phẩm: ${list.length}`;
    footer.font = { name: 'Arial', size: 12, bold: true };
    footer.alignment = { horizontal: 'left', vertical: 'middle' };
  
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `DanhSachSanPham_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success('Xuất file Excel thành công!');
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      toast.error('Lỗi khi xuất file Excel!');
    }
  };
  useEffect(() => {
    fetchList();
  }, []);
  return (
    <div>
      <p className="text-2xl font-bold mb-4">Danh Sách Sản Phẩm</p>
      <button
        onClick={exportToExcel}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md mb-4 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Xuất File Excel
      </button>
      {list.length === 0 ? (
        <p className="text-center text-gray-500">Không có sản phẩm nào!</p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
            <b>Hình Ảnh</b>
            <b>Tên Sản Phẩm</b>
            <b>Danh Mục</b>
            <b>Giá</b>
            <b className="text-center">Hành Động</b>
          </div>

          {list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm" key={index}>
              <img className="w-12" src={item.image[0]} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{formatCurrency(item.price)}</p>
              <div className="flex justify-end md:justify-center gap-2">
                <button
                  onClick={() => navigate(`/update/${item._id}`)}
                  className="text-blue-500"
                >
                  Sửa
                </button>

                <p
                  onClick={() => removeProduct(item._id)}
                  className="text-right md:text-center cursor-pointer text-lg text-red-500"
                >
                  X
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
