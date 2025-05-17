import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import Update from './pages/Update'; 
import SalesReport from './pages/SalesReport'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowUp } from 'react-icons/fa';



export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = ' đ'
export const formatCurrency = (amount) => {
  return `${amount.toLocaleString('vi-VN')}${currency}`;
};

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');
  const [showScrollToTop, setShowScrollToTop] = useState(false);


  // Theo dõi sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path="/update/:id" element={<Update token={token} />} />
                <Route path="/sales-report" element={<SalesReport token={token} />} />

              </Routes>
            </div>
          </div>
        </>
      }
            {/* Icon cuộn lên đầu trang */}
            {showScrollToTop && (
        <div
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 bg-black text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-gray-700 transition-all duration-300 transform ${showScrollToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <FaArrowUp size={20} />
        </div>

      )}
    </div>
  )
}

export default App
