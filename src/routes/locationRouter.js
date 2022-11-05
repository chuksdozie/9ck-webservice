const { Router } = require('express')
const auth = require('../middlewares/auth')
const { locationController } = require('../controllers')
const router = Router()

router.use(auth)
// router.route('/signup').post(authController.signUp)
// router.route('/verify/:token').get(authController.verifyEmail)
router.route('/add').post(locationController.addNewLocation)
router.route('/all').get(locationController.getLocations)
// router
//     .route('/verify-password-link/:token')
//     .get(authController.verifyPasswordLink)
// router.route('/reset-password/:token').post(authController.resetPassword)

module.exports = router
