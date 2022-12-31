const catchAsync = require('../helpers/catchAsync')
const { Parent } = require('../models')
const AppError = require('../helpers/appError')

const ParentController = {
    /**
     * @function createParent
     * @route /api/v1/parent/create
     * @method POST
     */
    createParent: catchAsync(async (req, res, next) => {
        try {
            const {
                g1_first_name,
                g1_last_name,
                g1_email,
                g2_first_name,
                g2_last_name,
                g2_email,
                address,
                alternative_address,
                g1_phone_number,
                g2_phone_number,
            } = req.body

            if (
                !g1_first_name ||
                !g1_last_name ||
                !g1_email ||
                !address ||
                !g1_phone_number
            ) {
                return next(
                    new AppError('Please fill in all required fields.', 400)
                )
            }

            const emailExists = await Parent.findOne({
                g1_email,
            })

            const phoneExists = await Parent.findOne({
                g1_phone_number,
            })

            if (emailExists) {
                return next(
                    new AppError(
                        'A parent with this Email address already exists.',
                        400
                    )
                )
            }

            if (phoneExists) {
                return next(
                    new AppError(
                        'A parent with this Phone number already exists.',
                        400
                    )
                )
            }

            const result = await Parent.create(req.body)

            res.status(201).json({
                status: 'Success',
                message: `Parent Creation Successful`,
                data: result,
            })
        } catch (error) {
            console.log(error)
            return next(new AppError('Something went wrong', 400))
        }
    }),

    /**
     * @function editParent
     * @route /api/v1/parent/:id/edit
     * @method POST
     */
    editParent: catchAsync(async (req, res, next) => {
        try {
            const { id } = req.params
            console.log(34567890, id)
            const {
                g1_first_name,
                g1_last_name,
                g1_email,
                g2_first_name,
                g2_last_name,
                g2_email,
                address,
                alternative_address,
                g1_phone_number,
                g2_phone_number,
            } = req.body

            if (
                !g1_first_name ||
                !g1_last_name ||
                !g1_email ||
                !address ||
                !g1_phone_number
            ) {
                return next(
                    new AppError('Please fill in all required fields.', 400)
                )
            }

            const parentExists = await Parent.findOne({ id })
            console.log(parentExists)

            if (!parentExists) {
                return next(new AppError('No such parent exists.', 400))
            }

            parentExists.g1_first_name = g1_first_name
            parentExists.g1_last_name = g1_last_name
            parentExists.g1_email = g1_email
            parentExists.g2_first_name = g2_first_name
            parentExists.g2_last_name = g2_last_name
            parentExists.g2_email = g2_email
            parentExists.address = address
            parentExists.alternative_address = alternative_address
            parentExists.g1_phone_number = g1_phone_number
            parentExists.g2_phone_number = g2_phone_number
            parentExists.updated_at = Date.now()
            parentExists.save()

            res.status(200).json({
                status: 'Success',
                message: `Parent Details Updated!`,
                data: parentExists,
            })
        } catch (error) {
            console.log(error)
            return next(new AppError('Something went wrong', 400))
        }
    }),

    /**
     * @function getAllParents
     * @route /api/v1/parent/all
     * @method GET
     */
    getAllParents: catchAsync(async (req, res, next) => {
        try {
            const parents = await Parent.find()

            res.status(200).json({
                status: 'Success',
                message: `Parents Fetched!`,
                data: parents,
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),

    /**
     * @function getSpecficParent
     * @route /api/v1/parent/specific/:id
     * @method GET
     */
    getSpecficParent: catchAsync(async (req, res, next) => {
        try {
            const { id } = req.params
            const parent = await Parent.findOne({ _id: id })
            if (!parent) {
                return next(new AppError('No such parent exists.', 400))
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
}

module.exports = ParentController
