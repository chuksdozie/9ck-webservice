const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const { Account } = require('../models')
const AppError = require('../helpers/appError')
const catchAsync = require('../helpers/catchAsync')

const auth = async (req, res, next) => {
    try {
        // 1) Getting token and check of it's there
        let token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        }
        if (!token) {
            return next(
                new AppError(
                    'You are not logged in! Please log in to get access.',
                    401
                )
            )
        }
        console.log(token, process.env.JWT_SECRET)

        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        console.log(111111, decoded)

        const currentUser = await Account.findById(decoded.id)
        if (!currentUser) {
            return next(
                new AppError(
                    'The user belonging to this token does no longer exist.',
                    401
                )
            )
        }
        // 4) Check if user changed password after the token was issued
        // if (currentUser.changedPasswordAfter(decoded.iat)) {
        //     return next(
        //         new AppError(
        //             'User recently changed password! Please log in again.',
        //             401
        //         )
        //     )
        // }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser

        next()
    } catch (error) {
        console.log(error)
        return next(new AppError(`${error}`, 400))
    }
}

module.exports = auth
