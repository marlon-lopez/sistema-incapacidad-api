const express = require('express')
const { register, login, getUser, updateUser } = require('../controllers/auth')
const { protect } = require('../middleware/protectRoutes')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getUser)
router.put('/update', protect, updateUser)

module.exports = router
