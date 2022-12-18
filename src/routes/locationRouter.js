const { Router } = require('express')
const auth = require('../middlewares/auth')
const { locationController } = require('../controllers')
const router = Router()

router.use(auth)

router.route('/add').post(locationController.addNewLocation)
router.route('/all').get(locationController.getLocations)

module.exports = router
