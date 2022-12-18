const mongoose = require('mongoose')

const parentSchema = new mongoose.Schema(
    {
        g1_first_name: {
            type: String,
            required: [true, 'First name must be defined'],
        },
        g1_last_name: {
            type: String,
            required: [true, 'Last name must be defined'],
        },
        g1_email: {
            type: String,
            required: [true, 'g1 email must be defined'],
        },
        g2_first_name: {
            type: String,
        },
        g2_last_name: {
            type: String,
        },
        g2_email: {
            type: String,
        },
        address: {
            type: String,
            required: [true, 'Address must be defined'],
        },
        alternative_address: {
            type: String,
        },
        g1_phone_number: {
            type: String,
            required: [true, 'Phone number must be defined'],
        },
        g2_phone_number: {
            type: String,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
        updated_at: {
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

// companyProfileSchema.pre(/^find/, function (next) {
//     this.populate('account_id')
//     next()
// })
const Parent = mongoose.model('Parent', parentSchema)

module.exports = Parent
