const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PharmacyBids = require("./PharmacyBid");
const Review = require("./Review");
const UserBid = require("./UserBid");
const PostView = require("./PostView");
const AcceptedOffer = require("./AcceptedOffer");
var moment = require("moment");

const UserPost = new Schema(
  {
    createdby: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user"
    },
    drugname: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    deliveryoption: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    isactive: {
      type: Boolean,
      required: true,
      default: true
    },
    pharmacybids: [PharmacyBids],
    acceptedoffer: AcceptedOffer,
    views: [PostView]
  },
  {
    timestamps: true
  }
);

UserPost.virtual("totalviews").get(function() {
  return this.views.length;
});

UserPost.virtual("totalbids").get(function() {
  return this.pharmacybids.length;
});

UserPost.virtual("bestbid").get(function() {
  let pharmacyBids = this.pharmacybids;
  let bestBid = Infinity;
  pharmacyBids.forEach(pharmacyBid => {
    if (pharmacyBid.counterprice < bestBid) {
      bestBid = pharmacyBid.counterprice;
    }
    if (pharmacyBid.counterBids.length > 0) {
      pharmacyBid.counterBids.forEach(counterBid => {
        if ("pharmacyid" in counterBid) {
          if (counterBid.counterprice < bestBid) {
            bestBid = counterBid.counterprice;
          }
        }
      });
    }
  });
  return bestBid;
});

UserPost.virtual("timeleft").get(function() {
  let starttime = moment(this.createdAt).add(this.duration, "days");
  let timediff = starttime.diff(new Date());
  let timeleft = moment.duration(starttime.diff(new Date()));
  let s =
    Math.floor(timeleft.asHours()) + moment.utc(timediff).format(":mm:ss");
  return s;
});

UserPost.set("toObject", { virtuals: true });
UserPost.set("toJSON", { virtuals: true });

module.exports = Post = mongoose.model("post", UserPost);
