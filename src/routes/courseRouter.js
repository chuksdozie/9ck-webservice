const { Router } = require('express')
const auth = require('../middlewares/auth')
const { courseController } = require('../controllers')
const router = Router()

router.use(auth)

router.route('/add').post(courseController.addNewCourse)
router.route('/all').get(courseController.getCourses)

module.exports = router
