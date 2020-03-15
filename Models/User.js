const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserDetails = require("./UserDetails");
const Pharmacy = require("./Pharmacy");
const Review = require("./Review");

const UserInfo = new Schema(
  {
    usertype: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    streetaddress: {
      type: String
    },
    state: {
      type: String
    },
    city: {
      type: String
    },
    zipcode: {
      type: Number
    },
    userdetails: {
      type: Schema.Types.Mixed,
      required: true
    },
    reviews: [Review]
  },
  {
    timestamps: true
  }
);

UserInfo.virtual("averagerating").get(function() {
  let reviews = this.reviews;
  let counter = 0;
  let avgRating = 0;
  reviews.forEach(review => {
    avgRating += review.rating;
    counter++;
  });
  return avgRating / counter;
});

// UserInfo.virtual("numberofbids").get(function() {
//   Post.find({
//     "pharmacybids.pharmacyid": this._id
//   })
//     .then(data => {
//       return data.length;
//     })
//     .catch(err => {
//       return 0;
//     });
// });

// UserInfo.virtual("numberfulfilled").get(function() {
//   return;
// });

UserInfo.set("toObject", { virtuals: true });
UserInfo.set("toJSON", { virtuals: true });

module.exports = User = mongoose.model("user", UserInfo);
