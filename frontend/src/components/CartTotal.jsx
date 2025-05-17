import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount, formatCurrency } = useContext(ShopContext);

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'TỔNG CỘNG'} text2={' GIỎ HÀNG'} />
      </div>
      
      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Tạm tính</p>
          <p>{formatCurrency(getCartAmount())}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Phí vận chuyển</p>
          <p>{formatCurrency(delivery_fee)}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <b>Tổng cộng</b>
          <b>{formatCurrency(getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee)}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
