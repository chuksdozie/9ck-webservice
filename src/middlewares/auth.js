const jwt = require('jsonwebtoken')
const { User } = require('../models')
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

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(111111, decoded)

        const currentUser = await User.findById(decoded.id)
        if (!currentUser) {
            return next(
                new AppError(
                    'The user belonging to this token does no longer exist.',
                    401
                )
            )
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser

        next()
    } catch (error) {
        console.log(error)
        return next(new AppError(`${error}`, 400))
    }
}

module.exports = auth
