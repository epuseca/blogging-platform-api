const jwt = require('jsonwebtoken')

const generateAccessToken = (payload) => {
    const access_token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: '15s' || process.env.JWT_EXPIRE
            // expiresIn: process.env.JWT_EXPIRE
        }
    )
    return access_token;
}

const generateRefreshToken = (payload) => {
    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE_REFRESH_TOKEN
        }
    )
    return refreshToken;
}

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            if (!token) {
                return resolve({
                    status: "ERROR",
                    message: "Refresh token is required!"
                })
            }
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.log('JWT verification error: ', err.message)
                    return resolve({
                        status: "ERROR",
                        message: err.name === 'TokenExpiredError'
                            ? "Refresh token has expired"
                            : "Invalid refresh token"
                    })
                }
                const access_token = generateAccessToken({
                    id: decoded.id,
                    email: decoded.email,
                    name: decoded.name,
                    role: decoded.role,
                });
                resolve({
                    status: "OK",
                    message: "Access token refreshed successfully",
                    access_token
                });
            })
        } catch (error) {
            reject({
                status: "ERROR",
                message: error.message
            })
        }
    })
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    refreshTokenJwtService
}
