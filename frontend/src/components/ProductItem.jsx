import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency, formatCurrency } = useContext(ShopContext); // Dùng hàm formatCurrency để định dạng giá tiền

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden'>
        <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt={name} />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-bold text-black'>{formatCurrency(price)}</p> {/* Đặt font-weight là bold */}
    </Link>
  );
};

export default ProductItem;
