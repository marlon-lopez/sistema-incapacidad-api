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

//@desc     Get all users and forms
//@route    POST /api/v1/auth/register
//@access   Public
exports.getUserList = asyncHandler(async (req, res) => {
  console.log('triggered')
  let data = await User.find().populate({
    path: 'forms',
    select: 'hopital doctor startDate endDate days ',
  })
  data.forEach((d) => {
    delete d._doc.password
  })
  res.json({
    success: true,
    count: data.length,
    data: data,
  })
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
// @route     PUT /api/v1/auth/updatedetails
// @access    Private

exports.updateUser = asyncHandler(async (req, res) => {
  let user = await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    },
  )
  delete user._doc.password
  res.status(200).json({ success: true, data: { user } })
})
