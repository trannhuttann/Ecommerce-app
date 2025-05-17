import React from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify'; // Đảm bảo bạn đã import react-toastify

const Navbar = ({ setToken }) => {
    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token'); // Xóa token khỏi localStorage
        toast.success('Đăng xuất thành công!'); // Hiển thị thông báo đăng xuất thành công
    };

    return (
        <div className='flex items-center py-2 px-[4%] justify-between'>
            <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
            <button onClick={handleLogout} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sn:textsm'>
                Đăng xuất
            </button>
        </div>
    );
};

export default Navbar;
