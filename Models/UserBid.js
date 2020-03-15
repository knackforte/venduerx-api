const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserBid = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user"
    },
    counterprice: {
      type: Number,
      required: true
    },
    deliveryoption: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = UserBid;
