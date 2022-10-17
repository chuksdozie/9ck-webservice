module.exports = {
    /**
     * @function isPasswordStandard
     * @param {*} password
     */
    isPasswordStandard: (password) => {
        if (!password) {
            return false
        }
        if (password.length < 8) {
            return false
        }
        return password
    },
}
