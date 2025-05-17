import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {

  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: 'Không có quyền truy cập, vui lòng đăng nhập lại' });
  }

  try {

    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    req.body.userId = token_decode.id
    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
};

export default authUser;