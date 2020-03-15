const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSkill = new Schema(
  {
    skillname: {
      type: String,
      required: true,
      ref: "user"
    }
  },

  {
    timestamps: true
  }
);

module.exports = Skill = mongoose.model("skill", UserSkill);
