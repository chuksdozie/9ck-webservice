const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            // required: [true, 'First name must be defined'],
        },
        last_name: {
            type: String,
            // required: [true, 'Last name must be defined'],
        },
        email: {
            type: String,
            required: [true, 'Email must be defined'],
        },
        type: {
            type: String,
            enum: ['user', 'admin', 'super-admin'],
            required: [true, 'Type must be defined'],
        },
        password: {
            type: String,
            required: [true, 'Password must be defined'],
        },
        phone_number: {
            type: String,
        },
        verified: {
            type: Boolean,
            required: [true, 'Verified status must be defined'],
            default: true,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
        updated_at: {
            type: Date,
        },
        logged_at: {
            type: Date,
        },
        deleted_at: {
            type: Date,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User
