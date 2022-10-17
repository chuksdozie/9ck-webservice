/** (c)2021 Buzzline
 * * Crafted @ Cogart Studio
 * * https://cogartstudio.com
 */

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        // account_id: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: [true, 'Account id must be defined'],
        //     ref: 'Account',
        // },
        company_name: {
            type: String,
            required: [true, 'Company name must be defined'],
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
const User = mongoose.model('User', userSchema)

module.exports = User
