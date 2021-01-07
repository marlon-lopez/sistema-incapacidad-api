const express = require('express')
const {
  register,
  login,
  getUser,
  updateUser,
  getUserList,
} = require('../controllers/auth')
const { protect, authorize } = require('../middleware/protectRoutes')

const router = express.Router()

router.post('/register', register)
router.get('/users', protect, authorize(), getUserList)
router.post('/login', login)
router.get('/me', protect, getUser)
router.put('/update', protect, updateUser)

module.exports = router
