const mongoose = require('mongoose')

const FormSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    hospital: {
      type: String,
      required: [true, 'Please add Hospital'],
    },
    doctor: {
      type: String,
      required: [true, 'Please add doctor´s name'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please add date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add date'],
    },
    days: {
      type: Number,
      required: [true],
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Form', FormSchema)
