const asyncHandler = require('express-async-handler')
const Form = require('../models/Form')

//@desc     Create Form
//@route    POST /api/v1/forms
//@access   Public

exports.createForm = asyncHandler(async (req, res) => {
  req.body.user = req.user._id

  const data = await Form.create(req.body)

  res.status(201).json({ success: true, count: data.length, data: data })
})

// @desc    Get all forms
// @route   GET /api/v1/forms
// @acces   private
exports.getAllForms = asyncHandler(async (req, res) => {
  const data = await Form.find().populate({
    path: 'user',
    select: 'name email code',
  })
  res.json({
    success: true,
    count: data.length,
    data: data,
  })
})

// @desc    Get own forms
// @route   GET /api/v1/forms
// @acces   private
exports.getOwnForms = asyncHandler(async (req, res) => {
  const data = await Form.find({ user: req.user._id })

  if (!data) {
    res.status(404)
    throw new Error('No resource found')
  }
  res.status(200).json({ success: true, count: data.length, data })
})

// @desc    Get single form
// @route   GET /api/v1/forms/:id
// @acces   private
exports.getSingleForm = asyncHandler(async (req, res) => {
  const data = await Form.findById(req.params.id)
  if (!data) {
    res.status(404)
    throw new Error(`Resource not found with id ${req.params.id}`)
  }
  res.status(200).json({ success: true, count: data.length, data })
})

// @desc    Update single form
// @route   UPDATE /api/v1/forms/:id
// @acces   private
exports.updateForm = asyncHandler(async (req, res) => {
  let data = await Form.findById(req.params.id)

  if (!data) {
    res.status(404)
    throw new Error(`Resource not found with id ${req.params.id}`)
  }
  //check if its the owner
  if (data.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error(`Not authorized to update resource`)
  }

  data = await Form.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    },
  )
  res.status(200).json({ success: true, count: data.length, data: data })
})

// @desc    Delete single form
// @route   DELETE /api/v1/forms/:id
// @acces   private
exports.deleteForm = asyncHandler(async (req, res) => {
  let data = await Form.findById(req.params.id)

  if (!data) {
    res.status(404)
    throw new Error(`Resource not found with id ${req.params.id}`)
  }

  //check if its the owner
  if (data.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error(`Not authorized to delete resource`)
  }
  data.remove()
  res.status(200).json({ success: true, count: data.length, data: data })
})
