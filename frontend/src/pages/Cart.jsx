import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import Swal from 'sweetalert2';

const Cart = () => {
  const { products, formatCurrency, cartItems, updateQuantity, setCartItems, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // Use effect to load the cart from localStorage when the component mounts
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || {};
      console.log('Loaded cart from localStorage:', savedCart);
      setCartItems(savedCart); // Set cart items to the loaded value
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
    }
  }, [setCartItems]);

  // Update cartData whenever cartItems or products change
  useEffect(() => {
    if (products.length > 0 && Object.keys(cartItems).length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Handle deleting an item from the cart
  const handleDelete = (id, size) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa nó!',
      cancelButtonText: 'Không, hủy!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        updateQuantity(id, size, 0); // Delete the item by setting its quantity to 0
        Swal.fire('Đã xóa!', 'Sản phẩm đã bị xóa khỏi giỏ hàng.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Hủy bỏ', 'Sản phẩm vẫn còn trong giỏ hàng.', 'info');
      }
    });
  };

  // Update quantity of an item in the cart
  const handleQuantityChange = (id, size, value) => {
    if (value === '' || value === '0') {
      return;
    }
    updateQuantity(id, size, Number(value)); // Update the quantity in the cart
  };

  // Ensure the cart is updated in localStorage whenever cartItems change
  useEffect(() => {
    if (Object.keys(cartItems).length > 0) {
      console.log('Saving cart to localStorage:', cartItems);
      localStorage.setItem('cart', JSON.stringify(cartItems)); // Save updated cart to localStorage
    }
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={'GIỎ HÀNG'} text2={' CỦA BẠN'} />
      </div>

      <div>
        {cartData.length > 0 ? (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            if (!productData) {
              return null; // If product not found, skip it
            }
            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img className="w-16 sm:w-20" src={productData.image[0]} alt={productData.name} />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">{productData.name}</p>
                    <div className="flex items-center gap-5 mt-2">
                      <p className="font-bold">{formatCurrency(productData.price)}</p> {/* Thêm font-bold để làm đậm giá */}
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                    </div>

                  </div>
                </div>
                <input
                  onChange={(e) => handleQuantityChange(item._id, item.size, e.target.value)}
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />
                <img
                  onClick={() => handleDelete(item._id, item.size)}
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  src={assets.bin_icon}
                  alt="Delete"
                />
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center mt-10">Giỏ hàng của bạn đang trống.</p>
        )}
      </div>

      {/* Nút thanh toán */}
      <div className="flex justify-end my-20">
        {cartData.length > 0 ? (
          <div className="w-full sm:w-[450px]">
            <CartTotal />
            <div className="w-full text-end">
              <button
                onClick={() => navigate('/place-order')}
                className="bg-black text-white text-sm my-8 px-8 py-3"
              >
                TIẾP TỤC THANH TOÁN
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
