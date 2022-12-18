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

            const parentExists = await Parent.findOne({
                g1_email,
            })

            if (parentExists) {
                return next(
                    new AppError(
                        'A parent with this Email address already exists.',
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

            const parentExists = await Parent.findById(id)

            if (!parentExists) {
                return next(new AppError('No such parent exists.', 400))
            }

            parentExists = req.body
            parentExists.updated_at = Date.now()
            parentExists.save()

            res.status(200).json({
                status: 'Success',
                message: `Parent Details Updated!`,
                data: parentExists,
            })
        } catch (error) {
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
                message: `Students Fetched!`,
                data: parents,
            })
        } catch (error) {
            return next(new AppError('Something went wrong', 400))
        }
    }),
}

module.exports = ParentController
