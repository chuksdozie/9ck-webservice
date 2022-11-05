const catchAsync = require('../helpers/catchAsync')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const redis = require('../services/redis')
const { sendMail } = require('../services/sendgrid')
const { Camp } = require('../models')
const AppError = require('../helpers/appError')
const { isPasswordStandard } = require('../utils/utility')

const CampController = {
    /**
     * @function addNewCamp
     * @route /api/v1/camp/add
     * @method POST
     */
    addNewCamp: catchAsync(async (req, res, next) => {
        try {
            const { user } = req
            const { name } = req.body

            if (user.type !== 'super-admin' && user.type !== 'admin') {
                return next(
                    new AppError(
                        'You are not authorized to carry out this action',
                        401
                    )
                )
            }

            if (!name) {
                return next(new AppError('Please fill in all fields', 400))
            }

            const campExists = await Camp.findOne({
                name,
            })

            if (campExists) {
                return next(new AppError('Camp already exists.', 400))
            }

            const myLocation = await Camp.create({
                name,
            })

            res.status(201).json({
                status: 'Success',
                message: `Camp added`,
                data: `Camp added`,
            })
        } catch (error) {
            return next(new AppError(error, 400))
        }
    }),

    /**
     * @function getCamps
     * @route /api/v1/camp/all
     * @method GET
     */
    getCamps: catchAsync(async (req, res, next) => {
        try {
            const camps = await Camp.find({})

            res.status(200).json({
                status: 'Success',
                message: `Camps fetched`,
                data: camps,
            })
        } catch (error) {
            return next(new AppError(error, 400))
        }
    }),
}

module.exports = CampController
