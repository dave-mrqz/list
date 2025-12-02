// models/List.js
const mongoose = require('mongoose');

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // optional: you can later add items to each list
    items: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model('List', listSchema);
