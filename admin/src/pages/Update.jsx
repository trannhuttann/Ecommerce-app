import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Update = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [editFields, setEditFields] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: '',
    description: '',
    sizes: [],
    bestseller: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/single/${id}`, {
          headers: { token },
        });

        if (response.data.success) {
          const { product } = response.data;
          setProduct(product);
          setEditFields({
            name: product.name,
            price: product.price,
            category: product.category || '',
            subcategory: product.subcategory || '',
            description: product.description,
            sizes: product.sizes || [],
            bestseller: product.bestseller || false,
          });
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(`Lỗi: ${error.message}`);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        { ...editFields, id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeToggle = (size) => {
    setEditFields((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Chỉnh sửa sản phẩm</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tên sản phẩm */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Tên sản phẩm</label>
          <input
            type="text"
            value={editFields.name}
            onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
            placeholder="Nhập tên sản phẩm"
            className="w-full border rounded-md p-3 focus:ring focus:ring-blue-300 shadow-sm"
          />
        </div>

        {/* Giá sản phẩm */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Giá sản phẩm</label>
          <input
            type="number"
            value={editFields.price}
            onChange={(e) => setEditFields({ ...editFields, price: e.target.value })}
            placeholder="Nhập giá sản phẩm"
            className="w-full border rounded-md p-3 focus:ring focus:ring-blue-300 shadow-sm"
          />
        </div>

        {/* Danh mục */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Danh mục</label>
          <select
            value={editFields.category}
            onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}
            className="w-full border rounded-md p-3 focus:ring focus:ring-blue-300 shadow-sm"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        {/* Danh mục phụ */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Danh mục phụ</label>
          <select
            value={editFields.subcategory}
            onChange={(e) => setEditFields({ ...editFields, subcategory: e.target.value })}
            className="w-full border rounded-md p-3 focus:ring focus:ring-blue-300 shadow-sm"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        {/* Mô tả sản phẩm */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Mô tả sản phẩm</label>
          <textarea
            value={editFields.description}
            onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
            placeholder="Nhập mô tả sản phẩm"
            className="w-full border rounded-md p-3 focus:ring focus:ring-blue-300 shadow-sm h-28"
          />
        </div>

        {/* Kích cỡ */}
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Kích cỡ sản phẩm</label>
          <div className="flex flex-wrap gap-3">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <div
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 cursor-pointer rounded-md shadow-sm ${
                  editFields.sizes.includes(size)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex items-center gap-4 col-span-2">
          <input
            type="checkbox"
            checked={editFields.bestseller}
            onChange={(e) => setEditFields({ ...editFields, bestseller: e.target.checked })}
            className="form-checkbox w-5 h-5 text-blue-600 focus:ring focus:ring-blue-300"
          />
          <span className="text-gray-700">Thêm vào bestseller</span>
        </div>
      </div>

      {/* Nút lưu */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-3 text-white font-medium rounded-md shadow-md focus:outline-none ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  );
};

export default Update;
