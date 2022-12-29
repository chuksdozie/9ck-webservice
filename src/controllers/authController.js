const catchAsync = require('../helpers/catchAsync')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const redis = require('../services/redis')
const { sendMail } = require('../services/sendgrid')
const { User } = require('../models')
const AppError = require('../helpers/appError')
const { isPasswordStandard } = require('../utils/utility')
const AuthController = {
    /**
     * @function emailVerificationSetup
     * @param {*} email
     * @returns verification link to be sent to employer email
     */
    emailVerificationSetup: async (email) => {
        let baseUrl = ''
        if (process.env.NODE_ENV === 'development') {
            baseUrl = process.env.LOCAL_BASE_URL
        } else {
            baseUrl = process.env.REMOTE_BASE_URL
        }

        // THIS IS TO GENERATE VERIFICATION LINK
        const token = uuid.v4()
        const emailKey = `${process.env.REDIS_PREFIX}-${token}`
        const mainurl = `${baseUrl}/api/v1/employer/verify/${token}`
        redis.set(emailKey, email, 'EX', 24 * 60 * 60) //delete after 24 hrs - 24*60*60

        const reciever = email
        const mailSubject = 'Welcome to 9ck'
        const mailContent = `<p>Thanks for registering, please <a href="${mainurl}", target="_blank"><button>Verify Email</button></a></p>`

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
     * @function signUp
     * @route /api/v1/employers/signup
     * @method POST
     */
    signUp: catchAsync(async (req, res, next) => {
        try {
            const { company_name, email, password } = req.body
            const emailExists = await Account.findOne({
                email_address: email,
            })

            if (emailExists) {
                return next(
                    new AppError(
                        'Email address already exists. Login instead!',
                        400
                    )
                )
            }
            let verifiedPassword = isPasswordStandard(password)
            if (!verifiedPassword) {
                return next(
                    new AppError(
                        'Invalid password format. Atleast 8 characters long',
                        400
                    )
                )
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const newCompany = {
                email_address: email,
                password: hashedPassword,
                type: 'employer',
            }
            const result = await Account.create(newCompany)
            const employer = await Account.findOne({ email_address: email })
            const myEmployer = CompanyProfile.create({
                account_id: employer.id,
                company_name: company_name,
            })
            const emailDetails = await AuthController.emailVerificationSetup(
                email
            )
            const sentEmail = await sendMail(
                emailDetails.reciever,
                emailDetails.mailSubject,
                emailDetails.mailContent
            )
            res.status(201).json({
                status: 'Success',
                message: `Account created successfully. A verification email has been sent to ${email}`,
                data: `A verification email has been sent to ${email}`,
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),

    /**
     * @function forgotPassword
     * @route /api/v1/employers/forgot-password
     * @method POST
     */
    forgotPassword: catchAsync(async (req, res, next) => {
        try {
            const { email } = req.body
            const emailExists = await Account.findOne({
                email_address: email,
            })

            if (!emailExists) {
                return next(
                    new AppError(
                        'Email address not registered to any user',
                        400
                    )
                )
            }

            const emailDetails = await AuthController.passwordResetEmailSetup(
                email
            )
            const sentEmail = await sendMail(
                emailDetails.reciever,
                emailDetails.mailSubject,
                emailDetails.mailContent
            )
            res.status(201).json({
                status: 'Success',
                message: `Password reset initiated. A reset email has been sent to ${email}`,
                data: `A reset email has been sent to ${email}`,
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),

    /**
     * @function verifyEmail
     * @route /api/v1/employers/verify/:token
     * @method GET
     */
    verifyEmail: catchAsync(async (req, res, next) => {
        try {
            const { token } = req.params

            const emailKey = `${process.env.REDIS_PREFIX}-${token}`

            const keyExists = await redis.exists(emailKey)
            // if key does not exist
            if (keyExists === 0) {
                return next(new AppError('Invalid token', 401))
            }
            const email = await redis.get(emailKey)

            let employer = await Account.findOne({ email_address: email })
            if (!employer) {
                return next(new AppError('User does not exist', 400))
            }
            employer.is_verified = true
            employer.save()

            // res.status(200).json({
            //     status: 'Success',
            //     message: `Account verified successfully`,
            //     data: `Your email (${email}) has been verified`,
            // })
            res.redirect('http://localhost:3000/onboarding/verified')
        } catch (error) {
            res.status(400).json({
                status: 'Error',
                message: error,
            })
        }
    }),

    /**
     * @function verifyPasswordLink
     * @route /api/v1/employers/verify-password-link/:token
     * @method GET
     */
    verifyPasswordLink: catchAsync(async (req, res, next) => {
        try {
            const { token } = req.params

            const emailKey = `${process.env.REDIS_PREFIX}-${token}`

            const keyExists = await redis.exists(emailKey)
            // if key does not exist
            if (keyExists === 0) {
                return next(new AppError('Invalid token', 401))
            }
            const email = await redis.get(emailKey)

            let employer = await Account.findOne({ email_address: email })
            if (!employer) {
                return next(new AppError('User does not exist', 400))
            }

            // res.status(200).json({
            //     status: 'Success',
            //     message: `Account verified successfully`,
            //     data: `Your email (${email}) has been verified`,
            // })
            res.redirect(
                `http://localhost:3000/onboarding/reset-password?token=${token}`
            )
        } catch (error) {
            res.status(400).json({
                status: 'Error',
                message: error,
            })
        }
    }),

    /**
     * @function Login
     * @route /api/v1/login
     * @method POST
     */
    login: catchAsync(async (req, res, next) => {
        try {
            const { email, password } = req.body
            let user = await User.findOne({
                email: email,
            })

            if (!user) {
                return next(
                    new AppError(
                        'No user with this email, sign up instead',
                        400
                    )
                )
            }

            const passwordMatch = await bcrypt.compare(password, user.password)
            if (!passwordMatch) {
                return next(new AppError('Incorrect password, try again.', 400))
            }
            // CHECK IF USER IS VERIFIED
            if (!user.verified) {
                return next(
                    new AppError(
                        'Please verify your email address then proceed to login',
                        400
                    )
                )
            }

            // create jwt
            const token = jwt.sign(
                {
                    id: user._id,
                    email: email,
                    type: user.type,
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            )

            user.logged_at = Date.now()
            user.save()

            res.status(200).json({
                status: 'Success',
                message: `User login successful`,
                data: user,
                token: token,
            })
        } catch (error) {
            return next(new AppError(error, 400))
        }
    }),

    /**
     * @function resetPassword
     * @route /api/v1/employer/reset-password/:token
     * @method POST
     */
    resetPassword: catchAsync(async (req, res, next) => {
        try {
            const { token } = req.params
            const { password, confirm_password } = req.body

            const emailKey = `${process.env.REDIS_PREFIX}-${token}`

            const keyExists = await redis.exists(emailKey)
            // if key does not exist
            if (keyExists === 0) {
                return next(new AppError('Invalid token', 401))
            }
            const email = await redis.get(emailKey)

            let employer = await Account.findOne({ email_address: email })
            if (!employer) {
                return next(new AppError('User does not exist', 400))
            }
            let verifiedPassword = isPasswordStandard(password)
            if (!verifiedPassword) {
                return next(new AppError('Invalid password format', 400))
            }

            if (password !== confirm_password) {
                return next(
                    new AppError(
                        'password and confirm password must be the same',
                        400
                    )
                )
            }
            const hashedPassword = await bcrypt.hash(password, 10)

            employer.password = hashedPassword
            employer.save()

            res.status(200).json({
                status: 'Success',
                message: `Password reset, successful, please Login with new password`,
            })
        } catch (error) {
            res.status(400).json({
                status: 'Error',
                message: error,
            })
        }
    }),
    /**
     * @function onboardingSurvey
     * @route /api/v1/employers/login
     * @method POST
     */
    onboardingSurvey: catchAsync(async (req, res, next) => {
        try {
            const {
                id,
                how_to_use_lobby,
                company_name,
                company_website,
                company_size,
                company_status,
                available_roles,
                roles_location,
                employee_level,
            } = req.body

            if (!id) {
                return next(new AppError('Account Not Found', 400))
            }
            let employer = await Account.findOne({
                _id: id,
            })
            let employerSurvey = await CompanyOnboardingSurvey.findOne({
                account_id: id,
            })
            if (!employer) {
                return next(new AppError('Account Not Found', 400))
            }
            if (employerSurvey) {
                res.status(200).json({
                    status: 'Success',
                    message: `Account Survey, complete`,
                    data: {},
                })
                return
            }
            const result = await CompanyOnboardingSurvey.create({
                account_id: employer.id,
                how_to_use_lobby,
                company_name,
                company_website,
                company_size,
                company_status,
                available_roles,
                roles_location,
                employee_level,
            }).then

            let employerSurveyAvailable = await CompanyOnboardingSurvey.findOne(
                {
                    account_id: employer.id,
                }
            )

            employer.stage = '2'
            await employer.save()

            res.status(200).json({
                status: 'Success',
                message: `Account Survey, complete`,
                data: {},
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),
}

module.exports = AuthController
