const catchAsync = require('../helpers/catchAsync')
const { Location } = require('../models')
const AppError = require('../helpers/appError')

const LocationController = {
    /**
     * @function addNewLocation
     * @route /api/v1/location/add
     * @method POST
     */
    addNewLocation: catchAsync(async (req, res, next) => {
        try {
            const { user } = req
            const { name, city, address, state } = req.body

            if (user.type !== 'super-admin' && user.type !== 'admin') {
                return next(
                    new AppError(
                        'You are not authorized to carry out this action',
                        401
                    )
                )
            }

            if (!name || !city || !address || !state) {
                return next(new AppError('Please fill in all fields', 400))
            }

            const locationExists = await Location.findOne({
                name,
            })

            if (locationExists) {
                return next(new AppError('Location already exists.', 400))
            }

            const myLocation = await Location.create({
                name,
                city,
                address,
                state,
            })

            res.status(201).json({
                status: 'Success',
                message: `Location added`,
                data: `Location added`,
            })
        } catch (error) {
            return next(new AppError(error, 400))
        }
    }),

    /**
     * @function getLocations
     * @route /api/v1/location/all
     * @method GET
     */
    getLocations: catchAsync(async (req, res, next) => {
        try {
            const locations = await Location.find({})

            res.status(200).json({
                status: 'Success',
                message: `Locations fetched`,
                data: locations,
            })
        } catch (error) {
            return next(new AppError(error, 400))
        }
    }),
}

module.exports = LocationController
