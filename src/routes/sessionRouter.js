const { Router } = require('express')
const auth = require('../middlewares/auth')
const { sessionController } = require('../controllers')
const router = Router()

// router.use(auth)

router
    .route('/session/:student_id/create')
    .post(sessionController.createSession)
router
    .route('/get-student-sessions/:student_id')
    .get(sessionController.getStudentSessions)

module.exports = router
