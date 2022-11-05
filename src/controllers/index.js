const authController = require('./authController')
const campController = require('./campController')
const courseController = require('./courseController')
const locationController = require('./locationController')
const parentController = require('./parentController')
const sessionController = require('./sessionController')
const studentController = require('./studentController')
const userController = require('./userController')

const models = require('../models')

module.exports = {
    authController,
    campController,
    courseController,
    locationController,
    parentController,
    sessionController,
    studentController,
    userController,
}
