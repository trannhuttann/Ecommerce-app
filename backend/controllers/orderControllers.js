import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

// Global variables (Biến toàn cục)
const currency = 'vnd';
const deliveryCharge = 10000;

// Gateway initialize (Khởi tạo cổng)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Đặt hàng sử dụng phương thức COD (thanh toán khi nhận hàng)
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: [] });

        res.json({ success: true, message: "Đơn hàng đã được đặt" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Stripe (Xác minh Stripe)
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Đặt hàng sử dụng phương thức Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Phí vận chuyển'
                },
                unit_amount: deliveryCharge
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Dữ liệu tất cả đơn hàng cho trang quản trị
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Dữ liệu đơn hàng của người dùng cho giao diện frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Cập nhật trạng thái đơn hàng từ trang quản trị
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Trạng thái đã được cập nhật' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


export { verifyStripe, placeOrder, placeOrderStripe, allOrders, updateStatus, userOrders };
