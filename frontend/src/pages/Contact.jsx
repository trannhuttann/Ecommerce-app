import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const Contact = () => {
  return (
    <div>
      <div className='text-center text-3xl pt-10 border-t'>
        <Title text1={'LIÊN HỆ'} text2={' CHÚNG TÔI'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-2xl text-gray-600'>Cửa Hàng Của Chúng Tôi</p>
          <p className='text-gray-600 text-lg'>63 Hẻm 20 Đường Huỳnh Tấn Phát <br /> Khu phố Hiệp Lễ, Phường Hiệp Ninh, Thành phố Tây Ninh, Tỉnh Tây Ninh</p>
          <p className='text-gray-600 text-lg'>Điện thoại: (0389) 636-525 <br /> Email: contact@forever.com</p>
          <p className='font-semibold text-2xl text-gray-600'>Cơ Hội Nghề Nghiệp tại Forever</p>
          <p className='text-gray-600 text-lg'>Tìm hiểu thêm về các đội ngũ và cơ hội việc làm của chúng tôi.</p>
          <button className='border border-black px-8 py-4 text-lg hover:bg-black hover:text-white transition-all duration-500'>Khám Phá Việc Làm</button>
        </div>
      </div>

      <div className="text-center mb-10">
        <p className='font-semibold text-2xl text-gray-600'>Vị trí Cửa Hàng của Chúng Tôi</p>
        <a href="https://maps.app.goo.gl/yie9iHUQcHDrbrLt6" target="_blank" rel="noopener noreferrer">
          <img className='w-full max-w-[300px] mx-auto cursor-pointer mt-4' src={assets.map_img} alt="Map Location" />
        </a>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact;
