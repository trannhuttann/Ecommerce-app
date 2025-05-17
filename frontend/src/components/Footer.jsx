import React from 'react'
import { assets } from '../assets/assets'
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Footer = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-lg'>
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="Logo" />
          <p className='w-full md:w-2/3 text-gray-600'>
            Forever là thương hiệu thời trang mang phong cách hiện đại, luôn cập nhật xu hướng mới nhất và cam kết mang đến cho khách hàng những sản phẩm chất lượng cao và phong cách độc đáo.
          </p>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>CÔNG TY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <Link to="/" className="hover:text-gray-800">Trang chủ</Link>
            </li>
            <li>
              <Link to="/collection" className="hover:text-gray-800">Sản phẩm</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-800">Giới thiệu</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>LIÊN HỆ</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li> (0389) 636-525</li>
            <li>contact@forever.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-center text-lg text-gray-600'>
          Copyright 2024@ forever.com - All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer
