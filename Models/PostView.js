const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostView = new Schema(
  {
    pharmacyid: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user"
    }
  },
  {
    timestamps: true
  }
);

module.exports = PostView;
