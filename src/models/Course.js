const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema(
    {
        course_name: {
            type: String,
            required: [true, 'Course name must be defined'],
        },
        course_code: {
            type: String,
            required: [true, 'Course code must be defined'],
        },
        description: {
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

// studentSchema.pre(/^find/, function (next) {
//     this.populate('parent_id')
//     next()
// })
const Course = mongoose.model('Course', courseSchema)

module.exports = Course
