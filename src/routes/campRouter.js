const { Router } = require('express')
const auth = require('../middlewares/auth')
const { campController } = require('../controllers')
const router = Router()

router.use(auth)
router.route('/add').post(campController.addNewCamp)
router.route('/all').get(campController.getCamps)

module.exports = router
