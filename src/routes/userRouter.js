const { Router } = require('express')
const auth = require('../middlewares/auth')
const { userController } = require('../controllers')
const router = Router()

// router.use(auth)
// router.route('/signup').post(authController.signUp)
// router.route('/verify/:token').get(authController.verifyEmail)
router.route('/login').post(userController.login)
// router.route('/forgot-password').post(authController.forgotPassword)
// router
//     .route('/verify-password-link/:token')
//     .get(authController.verifyPasswordLink)
// router.route('/reset-password/:token').post(authController.resetPassword)

module.exports = router
