const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },

    createdby: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user"
    }
  },
  {
    timestamps: true
  }
);

module.exports = Review;
