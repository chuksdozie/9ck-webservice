const mongoose = require('mongoose')

const userwwSchema = new mongoose.Schema(
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
const Userww = mongoose.model('Userwww', userwwSchema)

module.exports = Userww
