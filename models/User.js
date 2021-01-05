const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please add an email'],
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'please enter a valid E-mail',
      ],
    },
    password: {
      type: String,
    },
    code: {
      type: String,
      required: [true, 'Please add your code'],
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    dui: {
      type: String,
      required: [true, 'Please add DUI number'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

//Mathc user entered password to the password in DB
UserSchema.methods.matchPassword = async function (enteredPass) {
  console.log(this.password)
  /*  if (enteredPass === this.password) {
    console.log('matched')
    return true
  } */
  return await bcrypt.compare(enteredPass, this.password)
}

//encrypt password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', UserSchema)
