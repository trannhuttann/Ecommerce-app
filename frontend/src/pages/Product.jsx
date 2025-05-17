import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, formatCurrency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [isZooming, setIsZooming] = useState(false);
  const zoomRef = useRef(null);

  // State quản lý modal ảnh
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Fetch dữ liệu sản phẩm dựa trên productId
  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  // Hiệu ứng zoom ảnh theo chuột
  const handleMouseMove = (e) => {
    if (!isZooming || !zoomRef.current) return;
    const rect = zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    zoomRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  const handleMouseEnter = () => setIsZooming(true);
  const handleMouseLeave = () => setIsZooming(false);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*---------------------Thông Tin Sản Phẩm----------------*/}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/*---------------Hình Ảnh Sản Phẩm-----------*/}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'
                alt=""
              />
            ))}
          </div>
          <div
            className='w-full sm:w-[80%] overflow-hidden relative cursor-pointer'
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsImageModalOpen(true)} // Mở modal khi click vào ảnh chính
          >
            <img
              ref={zoomRef}
              className={`w-full h-auto transition-transform duration-500 ${
                isZooming ? 'scale-[2.5]' : 'scale-100'
              }`}
              src={image}
              alt="Product Image"
            />
          </div>
        </div>
        {/* -----------------Thông Tin Chi Tiết-------------*/}
        <div className='flex-1'>
          <h1 className='font-medium text-3xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_dull_icon} alt="" className='w-3.5' />
            <p className='pl-2 text-lg'>(122 đánh giá)</p>
          </div>
          <p className='mt-5 text-4xl font-medium'>{formatCurrency(productData.price)}</p>
          <p className='mt-5 text-gray-500 md:w-4/5 text-lg'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p className='text-lg'>Chọn kích cỡ</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className='bg-black text-white px-8 py-3 mt-5 rounded'
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/*---------Phần Mô Tả và Đánh Giá------------*/}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Mô Tả</b>
          <p className='border px-5 py-3 text-sm'>Đánh Giá (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p className='text-lg'>
            Forever là một cửa hàng thời trang trực tuyến, cung cấp các sản phẩm đa dạng từ phong cách thanh lịch đến
            năng động, phù hợp với mọi phong cách và lứa tuổi.
          </p>
        </div>
      </div>

      {/* Modal Hiển Thị Ảnh Lớn */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setIsImageModalOpen(false)} // Đóng modal khi click ra ngoài
        >
          <img
            src={image}
            alt="Product Zoomed"
            className="max-w-[90%] max-h-[90%] object-contain"
          />
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/*-----Hiển Thị Các Sản Phẩm Liên Quan--------*/}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className='opacity-0'></div>
  );
};

export default Product;
