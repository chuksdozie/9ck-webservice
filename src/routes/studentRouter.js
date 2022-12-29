const { Router } = require('express')
const auth = require('../middlewares/auth')
const { studentController } = require('../controllers')
const router = Router()

// router.use(auth)

router.route('/all').get(studentController.getAllStudents)
router
    .route('/get-my-kids/:parent_id')
    .get(studentController.getStudentsUnderParent)
router.route('/:parent_id/create').post(studentController.createStudent)
router.route('/:id/edit').post(studentController.editStudent)
router.route('/specific/:id').get(studentController.getSpecficStudent)

module.exports = router
