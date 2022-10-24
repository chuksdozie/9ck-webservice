/** (c)2021 Buzzline
 * * Crafted @ Cogart Studio
 * * https://cogartstudio.com
 */

const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Location name must be defined'],
        },
        city: {
            type: String,
            required: [true, 'Location city must be defined'],
        },
        address: {
            type: String,
            required: [true, 'Location address must be defined'],
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

// studentSchema.pre(/^find/, function (next) {
//     this.populate('parent_id')
//     next()
// })
const Location = mongoose.model('Location', locationSchema)

module.exports = Location
