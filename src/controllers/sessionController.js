const catchAsync = require('../helpers/catchAsync')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const redis = require('../services/redis')
const { sendMail } = require('../services/sendgrid')
const { Session } = require('../models')
const AppError = require('../helpers/appError')
const { isPasswordStandard } = require('../utils/utility')

const SessionController = {
    /**
     * @function createSession
     * @route /api/v1/session/:student_id/create
     * @method POST
     */
    createSession: catchAsync(async (req, res, next) => {
        try {
            const { student_id } = req.params
            const { course_id, camp_id, location_id, mode } = req.body

            if (!student_id || !course_id || !camp_id || !mode) {
                return next(
                    new AppError('Please fill in all required fields.', 400)
                )
            }

            const result = await Session.create(req.body)

            res.status(201).json({
                status: 'Success',
                message: `Session Creation Successful`,
                data: result,
            })
        } catch (error) {
            console.log(error)
            return next(new AppError('Something went wrong', 400))
        }
    }),

    /**
     * @function getStudentSessions
     * @route /api/v1/session/get-student-sessions/:student_id
     * @method GET
     */
    getStudentSessions: catchAsync(async (req, res, next) => {
        try {
            const { student_id } = req.params
            console.log(34567890, student_id)
            const sessions = await Session.find({ student_id })

            res.status(200).json({
                status: 'Success',
                message: `Student Sessions Fetched!`,
                data: sessions,
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),
}

module.exports = SessionController
