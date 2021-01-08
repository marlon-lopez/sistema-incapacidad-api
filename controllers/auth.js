const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const { generateToken } = require('../utils/generateToken')

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public

exports.register = asyncHandler(async (req, res) => {
  const { email } = req.body
  //chekc if user already exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User with that email already exists')
  }
  //create the user
  const user = await User.create({ ...req.body })
  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    },
  })
})

//@desc     Login user
//@route    POST /api/v1/auth/register
//@access   Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Validate emil & password
  if (!email || !password) {
    res.status(400)
    throw new Error(`Please provide an email and password`)
  }
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      },
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

//@desc     Get current user
//@route    GET /api/v1/auth/me
//@access   Private
exports.getUser = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new Error('Not authorized, token failed')
  }
  res.status(200).json({ success: true, data: { user } })
})

// @desc      update user deatils
// @route     PUT /api/v1/auth/update
// @access    Private

exports.updateUser = asyncHandler(async (req, res) => {
  let user = await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    },
  ).select('-password')
  res.status(200).json({ success: true, data: { user } })
})

// @desc      delete my user
// @route     delete /api/v1/auth/me
// @access    Private

exports.deleteMyUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(401)
    throw new Error('Not authorized')
  }
  await User.deleteOne({ _id: req.user._id })
  res.status(201).json({ success: true, data: {} })
})

/*CONTROLLERS FOR THE ADMIN USER*/

//@desc     Get all users and forms
//@route    GET /api/v1/auth/users
//@access   Private
exports.getUserList = asyncHandler(async (req, res) => {
  let data = await User.find().select('-password').populate({
    path: 'forms',
    select: 'hopital doctor startDate endDate days ',
  })

  res.json({
    success: true,
    count: data.length,
    data: data,
  })
})

// @desc      Get specific user
// @route     GET /api/v1/auth/users/:id
// @access    Private

exports.getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) {
    res.status(404)
    throw new Error(`User not found with id ${req.params.id}`)
  }
  res.status(201).json({ success: true, data: user })
})

// @desc      Create user
// @route     POST /api/v1/auth/users
// @access    Private

exports.createUser = asyncHandler(async (req, res) => {
  const { email } = req.body

  //chekc if user already exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User with that email already exists')
  }
  //create the user
  const user = await User.create({ ...req.body })
  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  })
})

// @desc      Update specific user
// @route     PUT /api/v1/auth/users/:id
// @access    Private

exports.updateSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc      delete specific user
// @route     delete /api/v1/auth/users/:id
// @access    Private

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error(`User not found with id ${req.params.id}`)
  }
  await User.deleteOne({ _id: req.params.id })
  res.status(201).json({ success: true, data: {} })
})
