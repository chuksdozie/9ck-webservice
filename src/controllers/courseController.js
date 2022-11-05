const catchAsync = require('../helpers/catchAsync')
const { Course } = require('../models')
const AppError = require('../helpers/appError')

const CourseController = {
    /**
     * @function addNewCourse
     * @route /api/v1/course/add
     * @method POST
     */
    addNewCourse: catchAsync(async (req, res, next) => {
        try {
            const { user } = req
            const { course_name, course_code, description } = req.body

            if (user.type !== 'super-admin' && user.type !== 'admin') {
                return next(
                    new AppError(
                        'You are not authorized to carry out this action',
                        401
                    )
                )
            }

            if (!course_name || !course_code) {
                return next(new AppError('Please fill in all fields', 400))
            }

            const courseExists = await Course.findOne({
                course_code,
            })

            if (courseExists) {
                return next(new AppError('Course already exists.', 400))
            }

            const myCourse = await Course.create({
                course_name,
                course_code,
                description,
            })

            res.status(201).json({
                status: 'Success',
                message: `Course added`,
                data: `Course added`,
            })
        } catch (error) {
            return next(new AppError(error, 400))
        }
    }),

    /**
     * @function getCourses
     * @route /api/v1/course/all
     * @method GET
     */
    getCourses: catchAsync(async (req, res, next) => {
        try {
            const courses = await Course.find({})

            res.status(200).json({
                status: 'Success',
                message: `Course fetched`,
                data: courses,
            })
        } catch (error) {
            return next(new AppError(error, 400))
        }
    }),
}

module.exports = CourseController
