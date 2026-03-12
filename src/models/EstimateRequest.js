const mongoose = require('mongoose');

const estimateRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160
    },
    service: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('EstimateRequest', estimateRequestSchema);
