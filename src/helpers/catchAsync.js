/**
 * @description ExpressJS controller wrapper for error handling
 *
 * @param {Function} catchAsync - the main controller
 * @param {Boolean} middleware - a flag to know if it's a middleware
 *
 * @returns {Function} - a callback that executes the controller
 */
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}
