/** (c)2021 Buzzline
 * * Crafted @ Cogart Studio
 * * https://cogartstudio.com
 */

const fs = require('fs')
const path = require('path')
const env = process.env.NODE_ENV || 'development'
const config = process.env

const models = {}

const basename = path.basename(__filename)

fs.readdirSync(__dirname)
    .filter(
        (file) =>
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
    )
    .forEach((file) => {
        const modelName = file.substr(0, file.length - 3) //remove the .js postfix
        const model = require(path.join(__dirname, file))
        models[modelName] = model
    })
module.exports = models
