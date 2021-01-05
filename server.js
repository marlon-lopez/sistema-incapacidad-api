const express = require('express')
const dotenv = require('dotenv').config({ path: './config/config.env' })
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const hpp = require('hpp')
const connecDB = require('./config/db')
const { errorHandler, notFound } = require('./middleware/error')

connecDB()
//routes
const auth = require('./routes/auth')
const form = require('./routes/form')

//Body parser

const app = express()

//body parser
app.use(express.json())

//add sanitize to prevent SQL injection sanitize data
app.use(mongoSanitize())

//set security headers
app.use(helmet())

//prevent XSS attacts
app.use(xss())

//prevent htpp params pollution
app.use(hpp())

//enable CORS
app.use(cors())

app.use('/api/v1/auth', auth)
app.use('/api/v1/forms', form)

app.use(errorHandler)
app.use(notFound)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server is in ${process.env.NODE_ENV} mode at ${PORT}`)
})
