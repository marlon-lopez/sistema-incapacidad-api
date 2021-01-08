const express = require('express')
const {
  register,
  login,
  getUser,
  updateUser,
  getUserList,
  deleteMyUser,
  deleteUser,
  createUser,
  updateSingleUser,
  getSingleUser,
} = require('../controllers/auth')
const { protect, authorize } = require('../middleware/protectRoutes')

const router = express.Router()

router.post('/register', register)
router.route('/users').get(protect, authorize(), getUserList)
router
  .route('/users/:id')
  .get(protect, authorize(), getSingleUser)
  .post(protect, authorize(), createUser)
  .delete(protect, authorize(), deleteUser)
  .put(protect, authorize(), updateSingleUser)

router.route('/me').get(protect, getUser).delete(protect, deleteMyUser)
router.post('/login', login)
router.put('/update', protect, updateUser)

module.exports = router
