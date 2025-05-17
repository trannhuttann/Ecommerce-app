import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });
            if (response.data.success) {
                setToken(response.data.token);
                toast.success("Đăng nhập thành công!"); // Thêm thông báo đăng nhập thành công
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Đăng nhập thất bại");
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-bold mb-4'>Trang Quản Trị</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Địa chỉ Email</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                            type="email"
                            placeholder='your@email.com'
                            required
                        />
                    </div>
                    <div className='mb-3 min-w-72 relative'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Mật khẩu</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
                            type={showPassword ? "text" : "password"}
                            placeholder='Nhập mật khẩu của bạn'
                            required
                        />
                        <span
                            className='absolute top-[38px] right-3 cursor-pointer text-gray-500'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </span>
                    </div>
                    <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type="submit">
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
