/** (c)2021 Buzzline
 * * Crafted @ Cogart Studio
 * * https://cogartstudio.com
 */

const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
    {
        parent_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Parent id must be defined'],
            ref: 'Parent',
        },
        first_name: {
            type: String,
            required: [true, 'First name must be defined'],
        },
        last_name: {
            type: String,
            required: [true, 'Last name must be defined'],
        },
        date_of_birth: {
            type: Date,
            required: [true, 'Date of birth must be defined'],
        },
        gender: {
            type: String,
            required: [true, 'Gender must be defined'],
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

studentSchema.pre(/^find/, function (next) {
    this.populate('parent_id')
    next()
})
const Student = mongoose.model('Student', studentSchema)

module.exports = Student
