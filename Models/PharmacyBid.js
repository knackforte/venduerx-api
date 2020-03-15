const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const PharmacyBid = new Schema(
  {
    pharmacyid: {
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
    },
    isdecline: {
      type: Boolean,
      required: true,
      default: false
    },
    counterBids: [
      {
        type: Schema.Types.Mixed,
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = PharmacyBid;
