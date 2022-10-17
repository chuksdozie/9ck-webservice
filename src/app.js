const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const csurf = require('csurf')
const mongoSanitize = require('express-mongo-sanitize')

const errorHandler = require('./middlewares/errorHandler')
const authRoutes = require('./routes')

const app = express(csurf())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(helmet())
app.use(
    cors({
        origin: '*',
    })
)
app.use(xss())
app.use(mongoSanitize())

app.use('/api/v1', authRoutes)

// health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Welcome to 9ck web service',
    })
})

app.use(errorHandler)

module.exports = app
