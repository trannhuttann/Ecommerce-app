import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!name || !description || !price || sizes.length === 0) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(backendUrl + "/api/product/add", formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setSizes([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full max-w-[700px] mx-auto p-6 bg-gray-100 rounded-lg shadow-lg"
    >
      {/* Upload Images */}
      <div>
        <p className="mb-3 text-lg font-semibold">Tải Lên Hình Ảnh</p>
        <div className="flex gap-3">
          {[image1, image2, image3, image4].map((img, idx) => (
            <label
              htmlFor={`image${idx + 1}`}
              key={idx}
              className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-400 rounded-md cursor-pointer"
            >
              <img
                className="object-cover w-full h-full"
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt={`Image ${idx + 1}`}
              />
              <input
                onChange={(e) =>
                  [setImage1, setImage2, setImage3, setImage4][idx](
                    e.target.files[0]
                  )
                }
                type="file"
                id={`image${idx + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full mt-6">
        <label className="block mb-2 text-lg font-semibold">Tên Sản Phẩm</label>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Nhập tên sản phẩm"
          required
        />
      </div>

      <div className="w-full mt-4">
        <label className="block mb-2 text-lg font-semibold">
          Mô Tả Sản Phẩm
        </label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập mô tả sản phẩm"
          required
        />
      </div>

      {/* Category and Price */}
      <div className="flex flex-col mt-4 sm:flex-row gap-4">
        <div>
          <label className="block mb-2 text-lg font-semibold">
            Danh Mục Sản Phẩm
          </label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-semibold">
            Danh Mục Phụ
          </label>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-semibold">Giá</label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            placeholder="Nhập giá"
            required
          />
        </div>
      </div>

      {/* Sizes */}
      <div className="mt-4">
        <label className="block mb-2 text-lg font-semibold">
          Kích Cỡ Sản Phẩm
        </label>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
              className={`px-4 py-2 border rounded-md cursor-pointer ${
                sizes.includes(size)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex items-center mt-4 gap-3">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
          className="w-5 h-5"
        />
        <label className="text-lg cursor-pointer" htmlFor="bestseller">
          Thêm vào Bestseller
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 mt-6 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Thêm Sản Phẩm
      </button>
    </form>
  );
};

export default Add;
