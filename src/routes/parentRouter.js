const { Router } = require('express')
const auth = require('../middlewares/auth')
const { parentController } = require('../controllers')
const router = Router()

// router.use(auth)
router.route('/create').post(parentController.createParent)
router.route('/:id/edit').post(parentController.editParent)
router.route('/all').get(parentController.getAllParents)
router.route('/specific/:id').get(parentController.getSpecficParent)

module.exports = router
