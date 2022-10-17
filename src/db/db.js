const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

module.exports = () => {
    const Db = process.env.LOCAL_DATABASE
    mongoose
        .connect(Db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Successfully connected to database')
        })
        .catch((err) => {
            throw new Error('Error connecting to database', err)
        })
}
