import React from 'react'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-3xl text-center pt-8 border-t'> 
        <Title text1={'GIỚI THIỆU'} text2={' VỀ CHÚNG TÔI'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-8 md:w-2/4 text-gray-600 text-lg'> 
          <p>Forever được sinh ra từ niềm đam mê đổi mới và mong muốn cách mạng hóa cách mọi người mua sắm trực tuyến. Hành trình của chúng tôi bắt đầu với một ý tưởng đơn giản: cung cấp một nền tảng nơi khách hàng có thể dễ dàng khám phá, tìm hiểu và mua sắm đa dạng sản phẩm ngay tại nhà.</p>
          <p>Kể từ khi thành lập, chúng tôi đã nỗ lực không ngừng để tuyển chọn đa dạng các sản phẩm chất lượng cao, đáp ứng mọi sở thích và phong cách. Từ thời trang và làm đẹp đến đồ điện tử và vật dụng gia đình, chúng tôi cung cấp bộ sưu tập phong phú từ các thương hiệu và nhà cung cấp uy tín.</p>
          <b className='text-gray-800 text-xl'>Sứ Mệnh Của Chúng Tôi</b>
          <p>Sứ mệnh của Forever là mang đến cho khách hàng sự lựa chọn, tiện lợi và sự tự tin. Chúng tôi cam kết mang lại trải nghiệm mua sắm liền mạch, vượt qua mong đợi của khách hàng từ khâu tìm kiếm, đặt hàng cho đến giao nhận và hơn thế nữa.</p>
        </div>
      </div>

      <div className='text-4xl py-4'>
          <Title text1={'TẠI SAO'} text2={' CHỌN CHÚNG TÔI'} />
      </div>

      <div className='flex flex-col md:flex-row text-base mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b className='text-xl'>Đảm Bảo Chất Lượng:</b> 
          <p className='text-gray-600 text-lg'>Chúng tôi tuyển chọn và kiểm tra kỹ lưỡng từng sản phẩm để đảm bảo chúng đạt tiêu chuẩn chất lượng cao của chúng tôi.</p> {/* Tăng kích thước nội dung */}
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b className='text-xl'>Tiện Lợi:</b>
          <p className='text-gray-600 text-lg'>Với giao diện thân thiện và quy trình đặt hàng dễ dàng, việc mua sắm chưa bao giờ trở nên đơn giản đến thế.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b className='text-xl'>Dịch Vụ Khách Hàng Xuất Sắc:</b>
          <p className='text-gray-600 text-lg'>Đội ngũ chuyên nghiệp của chúng tôi luôn sẵn sàng hỗ trợ bạn, đảm bảo sự hài lòng của bạn là ưu tiên hàng đầu.</p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default About
