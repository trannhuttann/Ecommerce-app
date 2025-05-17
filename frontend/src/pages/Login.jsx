import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebaseConfig';

const Login = () => {
  const [currentState, setCurrentState] = useState('Đăng nhập');
  const [resetPassword, setResetPassword] = useState(false);
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/reset-password', { email });
      if (response.data.success) {
        toast.success('Yêu cầu đặt lại mật khẩu đã được gửi!');
        setResetPassword(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Có lỗi xảy ra!');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Đăng ký') {
        if (password !== confirmPassword) {
          toast.error('Mật khẩu xác nhận không khớp!');
          return;
        }
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Đăng ký thành công!');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Đăng nhập thành công!');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const signInWithGoogle = (event) => {
    event.preventDefault(); // Ngăn chặn việc làm mới trang khi bấm nút
    signInWithPopup(auth, provider)
      .then((response) => {
        const userLocal = {
          email: response.user.email,
          userName: response.user.displayName,
          image: response.user.photoURL,
          userId: response.user.uid,
        };
        localStorage.setItem("userLocal", JSON.stringify(userLocal));
        navigate("/");
        toast.success('Đăng nhập với Google thành công!');
      })
      .catch((error) => {
        console.log(error);
        toast.error('Đã xảy ra lỗi khi đăng nhập với Google.');
      });
  };
  
  

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form
      onSubmit={resetPassword ? (e) => e.preventDefault() : onSubmitHandler}
      className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
    >
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{resetPassword ? 'Quên mật khẩu' : currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {resetPassword ? (
        <>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Nhập email để nhận mật khẩu mới'
            required
          />
          <button
            type="button"
            onClick={handleResetPassword}
            className='bg-black text-white font-light px-8 py-2 mt-4'
          >
            Gửi yêu cầu
          </button>
          <p onClick={() => setResetPassword(false)} className='cursor-pointer text-sm mt-2'>
            Quay lại đăng nhập
          </p>
        </>
      ) : (
        <>
          {currentState === 'Đăng ký' && (
            <>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className='w-full px-3 py-2 border border-gray-800'
                placeholder='Nhập tên người dùng'
                required
              />
            </>
          )}
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='your@email.com'
            required
          />
          <div className="relative w-full">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? 'text' : 'password'}
              className='w-full px-3 py-2 border border-gray-800'
              placeholder='Nhập mật khẩu của bạn'
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          {currentState === 'Đăng ký' && (
            <div className="relative w-full mt-2">
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type={showConfirmPassword ? 'text' : 'password'}
                className='w-full px-3 py-2 border border-gray-800'
                placeholder='Nhập lại mật khẩu'
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          )}
          <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <p onClick={() => setResetPassword(true)} className='cursor-pointer'>Quên mật khẩu</p>
            {currentState === 'Đăng nhập'
              ? <p onClick={() => setCurrentState('Đăng ký')} className='cursor-pointer'>Tạo tài khoản mới</p>
              : <p onClick={() => setCurrentState('Đăng nhập')} className='cursor-pointer'>Đăng nhập ngay</p>
            }
          </div>
          <button className='bg-black text-white font-light px-8 py-2 mt-4'>
            {currentState === 'Đăng nhập' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
          <div className='text-center my-3'>
            <span>Hoặc</span>
          </div>
          <div>
            <button
              onClick={signInWithGoogle}
              className='w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-2 hover:bg-gray-100 transition-colors duration-200'>
              <img
                height={20}
                width={20}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-G%22_logo.svg.png"
                alt=""
              />
              Đăng nhập với Google
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default Login;
