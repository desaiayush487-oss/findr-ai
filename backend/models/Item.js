const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Electronics', 'ID & Cards', 'Keys', 'Clothing', 'Books & Stationery', 'Others'],
      default: 'Others',
    },
    location: {
      type: String,
      required: [true, 'Please specify the location'],
    },
    type: {
      type: String,
      required: true,
      enum: ['LOST', 'FOUND'],
    },
    status: {
      type: String,
      enum: ['OPEN', 'RESOLVED'],
      default: 'OPEN',
    },
    image: {
      type: String,
      default: '',
    },
  
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);