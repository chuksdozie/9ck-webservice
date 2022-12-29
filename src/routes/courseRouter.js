const { Router } = require('express')
const auth = require('../middlewares/auth')
const { courseController } = require('../controllers')
const router = Router()

// router.use(auth)

router.route('/add').post(auth, courseController.addNewCourse)
router.route('/all').get(auth, courseController.getCourses)

module.exports = router
