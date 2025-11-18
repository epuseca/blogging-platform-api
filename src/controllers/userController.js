const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, refreshTokenJwtService } = require('../services/JwtService');

const account = async (req, res) => {
    res.json({ success: true, message: "Account data retrieved successfully" });
}

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({
                status: "ERROR",
                success: false,
                message: "Email is already exist!"
            })
        }

        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        })
        await user.save()

        const userResponse = { id: user._id, name: user.name, email: user.email, role: user.role };

        res.status(201).json({
            success: true,
            message: "User is created",
            data: { user: userResponse }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Something were wrong!",
            error: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(401)({
                success: false,
                message: "Email, password is not correct!"
            })
        }
        const isMatchPassword = await bcrypt.compare(password, user.password)
        if (!isMatchPassword) {
            return res.status(401).json({
                success: false,
                message: "Password is not match!"
            })
        }
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        const access_token = generateAccessToken(payload)
        const refresh_token = generateRefreshToken(payload)
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });
        return res.status(200).json({
            success: true,
            message: "Login successfully",
            user: {
                access_token,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        });
    }
}

const refresh_token = async (req, res) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is not valid!"
            })
        }
        const result = await refreshTokenJwtService(refresh_token);
        if (result.status === "ERROR") {
            return res.status.json(401)({
                success: false,
                message: result.message
            })
        }
        return res.status(200).json({
            success: true,
            message: result.message,
            access_token: result.access_token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error refresh token",
            error: error.message
        })
    }
}


const logout = async (req, res) => {
    try {
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        })
        return res.status(200).json({
            success: true,
            message: 'Logout successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error during logout process",
            error: error.message
        })
    }
}

module.exports = {
    register, login, account, refresh_token, logout
}