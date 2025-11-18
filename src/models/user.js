const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'user', 'customer']
        },
        default: 'user'
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User;