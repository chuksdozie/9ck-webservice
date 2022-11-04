const { Router } = require('express')
const authRouter = require('./authRouter')
const campRouter = require('./campRouter')
const courseRouter = require('./courseRouter')
const locationRouter = require('./locationRouter')
const parentRouter = require('./parentRouter')
const sessionRouter = require('./sessionRouter')
const studentRouter = require('./studentRouter')

const router = Router()

router.use('/', authRouter)
router.use('/camp', campRouter)
router.use('/course', courseRouter)
router.use('/location', locationRouter)
router.use('/parent', parentRouter)
router.use('/session', sessionRouter)
router.use('/student', studentRouter)

module.exports = router
