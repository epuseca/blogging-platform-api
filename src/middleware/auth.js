const jwt = require("jsonwebtoken")

const authAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Bạn chưa truyền ACCESS TOKEN ở header hoặc format không đúng (Bearer <token>)"
        })
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "ACCESS TOKEN không hợp lệ!"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                status: `You login with ${decoded.role}'s role`,
                message: "Bạn không có quyền truy cập. Chỉ admin mới được phép."
            })
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
            createBy: "GiaLoc"
        }
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token đã hết hạn, vui lòng đăng nhập lại"
            })
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ"
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Lỗi xác thực token"
            })
        }
    }
}

const authProfile = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Bạn chưa truyền ACCESS TOKEN ở header hoặc format không đúng (Bearer <token>)"
        })
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "ACCESS TOKEN không hợp lệ!"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const idParam = req.params.id;
        if (decoded.role !== 'admin' && decoded.id !== idParam) {
            return res.status(403).json({
                success: false,
                status: `You login with ${decoded.role}'s role`,
                message: "Bạn không có quyền truy cập. Chỉ admin hoặc người dùng mới được phép xem thông tin này."
            })
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
            createBy: "GiaLoc"
        }
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token đã hết hạn, vui lòng đăng nhập lại"
            })
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ"
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Lỗi xác thực token"
            })
        }
    }
}



module.exports = { authAdmin, authProfile }