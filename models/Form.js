const mongoose = require('mongoose')

const FormSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Form', FormSchema)
