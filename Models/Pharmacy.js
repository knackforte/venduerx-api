const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Pharmacy = new Schema(
  {
    storename: {
      type: String,
      required: true
    },
    staffname: {
      type: String,
      required: true
    },
    picture: {
      type: String,
      required: false
    },
    about: {
      type: String,
      required: true
    },
    skillname: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = Pharmacy;
