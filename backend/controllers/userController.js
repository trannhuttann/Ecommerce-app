import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Route đăng nhập cho người dùng
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Thông tin đăng nhập không hợp lệ' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route đăng ký cho người dùng
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra người dùng đã tồn tại hay chưa
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Người dùng đã tồn tại" });
        }

        // Kiểm tra định dạng email và mật khẩu mạnh
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Vui lòng nhập một email hợp lệ" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Vui lòng nhập mật khẩu mạnh" });
        }

        // Mã hóa mật khẩu người dùng
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Route đăng nhập cho admin
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIl && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Thông tin đăng nhập không hợp lệ" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export { loginUser, registerUser, adminLogin };