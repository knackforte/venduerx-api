const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AcceptedOffer = new Schema(
  {
    pharmacyid: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user"
    },
    acceptedby: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user"
    }
  },
  {
    timestamps: true
  }
);

module.exports = AcceptedOffer;
