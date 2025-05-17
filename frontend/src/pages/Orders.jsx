import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency, formatCurrency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          if (Array.isArray(order.items)) {
            order.items.forEach((item) => {
              // Đảm bảo tất cả các trường được định nghĩa
              item.image = item.image || [];
              item['status'] = order.status || 'Chưa xác định';
              item['payment'] = order.payment || 'Chưa xác định';
              item['paymentMethod'] = order.paymentMethod || 'Chưa xác định';
              item['date'] = order.date || new Date();
              allOrdersItem.push(item);
            });
          }
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Failed to load order data:', error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token, backendUrl]);

  return (
    <div className="border-t pt-16">
      {/* Tiêu đề */}
      <div className="text-2xl">
        <Title text1={'ĐƠN HÀNG'} text2={' CỦA TÔI'} />
      </div>

      {/* Danh sách đơn hàng */}
      <div>
        {orderData.length > 0 ? (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Thông tin sản phẩm */}
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20"
                  src={Array.isArray(item.image) && item.image.length > 0 ? item.image[0] : '/path/to/default-image.jpg'}
                  alt={item.name || 'Product Image'}
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p className="font-semibold">{formatCurrency(item.price) || '0'}</p>
                    <p>Số lượng: {item.quantity || 1}</p>
                    <p>Size: {item.size || 'Không xác định'}</p>
                  </div>

                  <p className="mt-1">
                    Ngày:{' '}
                    <span className="text-gray-400">
                      {item.date ? new Date(item.date).toLocaleDateString('vi-VN') : 'Không xác định'}
                    </span>
                  </p>
                  <p className="mt-1">
                    Phương thức thanh toán:{' '}
                    <span className="text-gray-400">{item.paymentMethod || 'Không xác định'}</span>
                  </p>
                </div>
              </div>
              {/* Trạng thái đơn hàng */}
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Theo dõi đơn hàng
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">Không có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
