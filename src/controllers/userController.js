const catchAsync = require('../helpers/catchAsync')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const redis = require('../services/redis')
const { sendMail } = require('../services/sendgrid')
const { User } = require('../models')
const AppError = require('../helpers/appError')
const { isPasswordStandard } = require('../utils/utility')

const UserController = {
    /**
     * @function emailVerificationSetup
     * @param {*} email
     * @returns verification link to be sent to employer email
     */
    onboardingEmailSetup: async (email, password) => {
        // THIS IS TO GENERATE PASSWORD

        const reciever = email
        const mailSubject = 'Welcome to 9ck'
        const mailContent = `<p>You have been added to 9ck.<p>Email: ${email}</p><p>Password: ${password}</p></p>`

        return { reciever, mailSubject, mailContent }
    },

    /**
     * @function passwordResetEmailSetup
     * @param {*} email
     * @returns verification link to be sent to employer email
     */
    passwordResetEmailSetup: async (email) => {
        let baseUrl = ''
        if (process.env.NODE_ENV === 'development') {
            baseUrl = process.env.LOCAL_BASE_URL
        } else {
            baseUrl = process.env.REMOTE_BASE_URL
        }

        // THIS IS TO GENERATE VERIFICATION LINK
        const token = uuid.v4()
        const emailKey = `${process.env.REDIS_PREFIX}-${token}`
        const mainurl = `${baseUrl}/api/v1/employer/verify-password-link/${token}`
        redis.set(emailKey, email, 'EX', 1 * 60 * 60) //delete after 1 hr - 1*60*60

        const reciever = email
        const mailSubject = 'Password Reset'
        const mailContent = `<p>You have made a request to reset your password <a href="${mainurl}", target="_blank"><button>Reset Password</button></a></p>`

        return { reciever, mailSubject, mailContent }
    },

    /**
     * @function addNewUser
     * @route /api/v1/user/add
     * @method POST
     */
    addNewUser: catchAsync(async (req, res, next) => {
        try {
            const { user } = req
            const { first_name, last_name, email, type } = req.body

            if (user.type !== 'super-admin') {
                return next(
                    new AppError(
                        'You are not authorized to carry out this action',
                        401
                    )
                )
            }

            const emailExists = await User.findOne({
                email,
            })

            if (emailExists) {
                return next(
                    new AppError(
                        'Email address already exists. User should Login instead!',
                        400
                    )
                )
            }

            const generatedPassword = '12345678'
            const hashedPassword = await bcrypt.hash(generatedPassword, 10)

            const myUser = await User.create({
                first_name,
                last_name,
                email,
                type,
                password: hashedPassword,
            })

            const emailDetails = await UserController.onboardingEmailSetup(
                email,
                generatedPassword
            )
            const sentEmail = await sendMail(
                emailDetails.reciever,
                emailDetails.mailSubject,
                emailDetails.mailContent
            )
            res.status(201).json({
                status: 'Success',
                message: `User created successfully. A credentials email has been sent to ${email}`,
                data: `A credentials email has been sent to ${email}`,
            })
        } catch (error) {
            return next(new AppError(error, 400))
        }
    }),
    /**
     * @function getUsers
     * @route /api/v1/user/all
     * @method GET
     */
    getUsers: catchAsync(async (req, res, next) => {
        try {
            const { user } = req

            if (user.type !== 'super-admin') {
                return next(
                    new AppError(
                        'You are not authorized to carry out this action',
                        401
                    )
                )
            }

            const users = await User.find({})

            res.status(200).json({
                status: 'Success',
                message: `Users fetched`,
                data: users,
            })
        } catch (error) {
            return next(new AppError(error, 400))
        }
    }),
}

module.exports = UserController
