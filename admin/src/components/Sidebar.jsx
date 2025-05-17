import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen bg-gray-800 text-white shadow-lg">
      {/* Logo / Tiêu đề */}
      <div className="p-6 text-center border-b border-gray-700">
        <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-4 mt-6">
      <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-3 rounded-l-full ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
            }`
          }
          to="/sales-report"
        >
          <img
            className="w-5 h-5"
            src={assets.order_icon}
            alt="statistics-icon"
          />
          <p>Thống kê doanh thu</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-3 rounded-l-full ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
            }`
          }
          to="/add"
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="add-icon" />
          <p>Thêm sản phẩm</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-3 rounded-l-full ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
            }`
          }
          to="/list"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="list-icon" />
          <p>Danh sách sản phẩm</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-3 rounded-l-full ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
            }`
          }
          to="/orders"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="orders-icon" />
          <p>Đơn hàng</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
