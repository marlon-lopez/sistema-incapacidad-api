const express = require('express')
const { protect, authorize } = require('../middleware/protectRoutes')
const {
  createForm,
  getAllForms,
  updateForm,
  deleteForm,
  getSingleForm,
  getOwnForms,
} = require('../controllers/form')

const router = express.Router()

router
  .route('/')
  .post(protect, createForm)
  .get(protect, authorize(), getAllForms)

router.route('/mine').get(protect, getOwnForms)

router
  .route('/:id')
  .put(protect, updateForm)
  .get(protect, getSingleForm)
  .delete(protect, deleteForm)

module.exports = router
