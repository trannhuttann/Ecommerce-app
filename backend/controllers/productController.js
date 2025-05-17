import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Hàm để thêm sản phẩm
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imageUrl,
            date: Date.now()
        };

        console.log(productData);

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Sản phẩm đã được thêm" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Hàm để liệt kê sản phẩm
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Hàm để xóa sản phẩm
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Sản phẩm đã được xóa" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Hàm để lấy thông tin một sản phẩm
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.params; // Lấy productId từ URL
        const product = await productModel.findById(productId); // Tìm sản phẩm theo ID
        if (!product) {
            return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
        }
        res.json({ success: true, product }); // Trả về thông tin sản phẩm
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// sửa sp
const updateProduct = async (req, res) => {
    try {
      const { id, name, description, price, category, subCategory, sizes, bestseller } = req.body;
  
      // Kiểm tra sự tồn tại của sản phẩm
      const product = await productModel.findById(id);
      if (!product) {
        return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
      }
  
      // Kiểm tra và phân tích sizes nếu có
      let sizesParsed = [];
      if (sizes) {
        // Kiểm tra nếu sizes là chuỗi JSON
        if (typeof sizes === 'string') {
          try {
            sizesParsed = JSON.parse(sizes); // Chuyển đổi sizes thành mảng nếu là chuỗi JSON
          } catch (e) {
            return res.json({ success: false, message: "Sizes không hợp lệ" });
          }
        } else {
          sizesParsed = sizes;  // Nếu sizes là mảng rồi thì giữ nguyên
        }
      }
  
      // Cập nhật thông tin sản phẩm
      const updatedData = {
        name,
        description,
        price: Number(price),
        category,
        subCategory,
        bestseller: bestseller === "true" ? true : false,
        sizes: sizesParsed,  // Đảm bảo sizes được phân tích đúng
      };
  
      // Cập nhật sản phẩm trong DB
      const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedProduct) {
        return res.json({ success: false, message: "Không thể cập nhật sản phẩm" });
      }
  
      res.json({ success: true, message: "Sản phẩm đã được cập nhật", product: updatedProduct });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };



export { listProducts, addProduct, removeProduct, singleProduct, updateProduct  };

