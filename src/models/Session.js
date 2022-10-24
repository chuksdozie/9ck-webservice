/** (c)2021 Buzzline
 * * Crafted @ Cogart Studio
 * * https://cogartstudio.com
 */

const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema(
    {
        student_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Student id must be defined'],
            ref: 'Student',
        },
        course_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Course id must be defined'],
            ref: 'Course',
        },
        camp_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Camp id must be defined'],
            ref: 'Camp',
        },
        location_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
        },
        mode: {
            type: String,
            enum: ['offline', 'online'],
            required: [true, 'mode must be defined'],
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
const Session = mongoose.model('Session', sessionSchema)

module.exports = Session
