const catchAsync = require('../helpers/catchAsync')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const redis = require('../services/redis')
const { sendMail } = require('../services/sendgrid')
const { Student, Parent } = require('../models')
const AppError = require('../helpers/appError')
const { isPasswordStandard } = require('../utils/utility')
const StudentController = {
    /**
     * @function createStudent
     * @route /api/v1/student/:parent_id/create
     * @method POST
     */
    createStudent: catchAsync(async (req, res, next) => {
        try {
            const { parent_id } = req.params
            const { first_name, last_name, date_of_birth, gender } = req.body

            if (!first_name || !last_name || !date_of_birth || !gender) {
                return next(
                    new AppError('Please fill in all required fields.', 400)
                )
            }

            const studentExists = await Student.findOne({
                parent_id,
                first_name,
                date_of_birth,
            })

            if (studentExists) {
                return next(
                    new AppError(
                        'A student with these same details already exists.',
                        400
                    )
                )
            }

            const result = await Student.create({ ...req.body, parent_id })

            res.status(201).json({
                status: 'Success',
                message: `Student Creation Successful`,
                data: result,
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),

    /**
     * @function editStudent
     * @route /api/v1/student/:id/edit
     * @method POST
     */
    editStudent: catchAsync(async (req, res, next) => {
        try {
            const { id } = req.params
            const { first_name, last_name, date_of_birth, gender } = req.body

            if (!first_name || !last_name || !date_of_birth || !gender) {
                return next(
                    new AppError('Please fill in all required fields.', 400)
                )
            }

            const studentExists = await Student.findById(id)

            if (!studentExists) {
                return next(new AppError('No such student exists.', 400))
            }

            studentExists = req.body
            studentExists.updated_at = Date.now()
            studentExists.save()

            res.status(200).json({
                status: 'Success',
                message: `Student Details Updated!`,
                data: studentExists,
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),

    /**
     * @function getAllStudents
     * @route /api/v1/student/all
     * @method GET
     */
    getAllStudents: catchAsync(async (req, res, next) => {
        try {
            const students = await Student.find()

            res.status(200).json({
                status: 'Success',
                message: `Students Fetched!`,
                data: students,
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),

    /**
     * @function getStudentsUnderParent
     * @route /api/v1/student/get-my-kids/:parent_id
     * @method GET
     */
    getStudentsUnderParent: catchAsync(async (req, res, next) => {
        try {
            const { parent_id } = req.params
            const students = await Student.find({ parent_id })

            res.status(200).json({
                status: 'Success',
                message: `Students Fetched!`,
                data: students,
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),

    /**
     * @function getMyParent
     * @route /api/v1/student/get-my-parent/:id
     * @method GET
     */
    getMyParent: catchAsync(async (req, res, next) => {
        try {
            const { id } = req.params
            const student = await Student.findById(id)
            if (!student) {
                return next(new AppError('No such student exists.', 400))
            }

            const parent = await Parent.findOne(student.parent_id)
            if (!parent) {
                return next(
                    new AppError('This student has no parent trace.', 400)
                )
            }

            res.status(200).json({
                status: 'Success',
                message: `Parent Fetched!`,
                data: parent,
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),

    /**
     * @function getSpecficStudent
     * @route /api/v1/student/specific/:id
     * @method GET
     */
    getSpecficStudent: catchAsync(async (req, res, next) => {
        try {
            const { id } = req.params
            const student = await Student.findOne({ _id: id })
            if (!student) {
                return next(new AppError('No such student exists.', 400))
            }

            res.status(200).json({
                status: 'Success',
                message: `Parent Fetched!`,
                data: student,
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),
}

module.exports = StudentController
