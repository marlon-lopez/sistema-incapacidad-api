const express = require('express')
const dotenv = require('dotenv').config({ path: './config/config.env' })
const mongoose = require('mongoose')
const connecDB = require('./config/db')
const { errorHandler, notFound } = require('./middleware/error')
const cors = require('cors')

connecDB()
//routes
const auth = require('./routes/auth')
const form = require('./routes/form')

//Body parser

const app = express()

//body parser
app.use(express.json())

app.use(cors())

app.use('/api/v1/auth', auth)
app.use('/api/v1/forms', form)

app.use(errorHandler)
app.use(notFound)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server is in ${process.env.NODE_ENV} mode at ${PORT}`)
})
