/** (c)2021 Buzzline
 * * Crafted @ Cogart Studio
 * * https://cogartstudio.com
 */

const mongoose = require('mongoose')

const campSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Camp name must be defined'],
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
const Camp = mongoose.model('Camp', campSchema)

module.exports = Camp
