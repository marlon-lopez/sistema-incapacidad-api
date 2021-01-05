/* const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  // Log in console the error
  console.log(error)

  //Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`
    error = new ErrorResponse(message, 404)
  }
  //Mongoose duplicated values at creating a bootcamp
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new ErrorResponse(message, 400)
  }
  //Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((element) => element.message)
    error = new ErrorResponse(message, 400)
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' })
}

module.exports = errorHandler
 */

exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

exports.errorHandler = (err, req, res, next) => {
  console.log(process.env.NODE_ENV)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV !== 'development' ? ' ' : err.stack,
  })
}
