const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pharmacy = require("../Models/Pharmacy.js");
const PharmaBid = require("../Models/PharmacyBid");
const Skill = require("../Models/Skill");
const User = require("../Models/User");
const Post = require("../Models/Post");
const OfferAccepted = require("../Models/AcceptedOffer");
const Transaction = require("mongoose-transactions");
const transaction = new Transaction();

router.post("/post", (req, res) => {
  const UserPost = new Post({
    createdby: req.body.createdby,
    drugname: req.body.drugname,
    quantity: req.body.quantity,
    city: req.body.city,
    deliveryoption: req.body.deliveryoption,
    price: req.body.price,
    duration: req.body.duration
  });
  UserPost.save()
    .then(() => {
      return res.status(200).json({
        message: "success"
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/updatepost", (req, res) => {
  Post.findByIdAndUpdate(req.body.postid, {
    drugname: req.body.drugname,
    quantity: req.body.quantity,
    city: req.body.city,
    deliveryoption: req.body.deliveryoption,
    price: req.body.price,
    duration: req.body.duration
  })
    .then(() => {
      return res.status(200).json({
        message: "success"
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/deletepost", (req, res) => {
  Post.findByIdAndDelete(req.body.postid)
    .then(() => {
      return res.status(200).json({
        message: "success"
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});
// pharmacy bidding on post
router.post("/pharmacybid", (req, res) => {
  const pharmaBid = {
    postid: req.body.postid,
    pharmacyid: req.body.pharmacyid,
    counterprice: req.body.counterprice,
    deliveryoption: req.body.deliveryoption
  };
  Post.findByIdAndUpdate(req.body.postid, {
    $push: { pharmacybids: pharmaBid }
  })
    .then(() => {
      return res.status(200).json({
        message: "success"
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

// router.post("/deletepharmacybid", (req, res) => {
//   PharmaBid.findOneAndDelete({
//     _id: req.body.userid,
//     pharmacyid: req.body.pharmacyid
//   })
//     .then(() => {
//       console.log("pharmacybid deleted");
//       res.json({
//         message: "Pharmacy Bid Deleted"
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.json({
//         message: "Error Found" + err
//       });
//     });
// });
// user will counter bid
router.post("/usercounterbid", (req, res) => {
  const usercounterbid = {
    userid: req.body.userid,
    counterprice: req.body.counterprice,
    deliveryoption: req.body.deliveryoption,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  Post.findOneAndUpdate(
    { _id: req.body.postid, "pharmacybids.pharmacyid": req.body.pharmacyid },
    {
      $push: { "pharmacybids.$.counterBids": usercounterbid }
    }
  )
    .then(() => {
      res.status(200).json({
        message: "success"
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/pharmacycounterbid", (req, res) => {
  const pharmaBid = {
    pharmacyid: req.body.pharmacyid,
    counterprice: req.body.counterprice,
    deliveryoption: req.body.deliveryoption,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  Post.findOneAndUpdate(
    { _id: req.body.postid, "pharmacybids.pharmacyid": req.body.pharmacyid },
    {
      $push: { "pharmacybids.$.counterBids": pharmaBid }
    }
  )
    .then(() => {
      return res.status(200).json({
        message: "success"
      });
    })
    .catch(err => {
      return res.status(400).json({
        message: "fail"
      });
    });
});
//
router.post("/addview", (req, res) => {
  const viewObj = {
    pharmacyid: req.body.pharmacyid
  };
  Post.find({ _id: req.body.postid, "views.pharmacyid": req.body.pharmacyid })
    .then(data => {
      if (data.length == 0) {
        Post.findOneAndUpdate(
          { _id: req.body.postid },
          {
            $push: { views: viewObj }
          }
        ).then(() => {
          return res.status(200).json({
            message: "success"
          });
        });
      } else {
        return res.status(400).json({
          message: "fail"
        });
      }
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

// router.post("/deletecounterbid", (req, res) => {
//   UserBid.findOneAndDelete({
//     _id: req.body.id,
//     userid: req.body.userid
//   })
//     .then(() => {
//       console.log("counterbid deleted");
//       res.json({
//         message: "counterbid deleted"
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.json({
//         message: "CounterBid Deleted"
//       });
//     });
// });

router.post("/getpostbiddersbypostid", (req, res) => {
  Post.findById(req.body.id)
    .populate("pharmacybids.pharmacyid")
    .then(data => {
      return res.status(200).json({
        data
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

// router.post("/userofferconfirmation", (req, res) => {
//   User.find({ _id: req.body.id })
//   .exec(function(err, data) {
//     User.aggregate(
//       [
//         { $match: { _id: data._id } },
//         { $unwind: "$reviews" },
//         {
//           $group: {
//             _id: { _id: "$_id" },
//             averageRating: { $avg: "$reviews.rating" }
//           }
//         },
//         { $project: { _id: 0 } }
//       ],
//       function(err, result) {
//         return res.json({
//           data
//           //result
//         });
//       }
//     );
//     //.populate("userdetails.storename")
//     .then(data => {
//       res.json(data);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

router.post("/offeraccepted", (req, res) => {
  const AcceptedOffer = {
    pharmacyid: req.body.pharmacyid,
    acceptedby: req.body.acceptedby
  };
  Post.findOneAndUpdate(
    { _id: req.body.postid },
    {
      acceptedoffer: AcceptedOffer,
      isactive: false
    }
  )
    .then(data => {
      return res.status(200).json({
        message: "success"
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/getpostsbyuserid", (req, res) => {
  console.log(req.body.userid);
  // return res.status(200).json(req);
  Post.find({ createdby: req.body.userid })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/getactivepostsbyuserid", (req, res) => {
  // console.log("Get active post by userid");
  Post.find({ createdby: req.body.userid, isactive: true })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/getclosedpostsbyuserid", (req, res) => {
  Post.find({ createdby: req.body.userid, isactive: false })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/declinepost", (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.body.postid, "pharmacybids.pharmacyid": req.body.pharmacyid },
    {
      "pharmacybids.$.isdecline": true
    }
  )
    .then(data => {
      return res.status(200).json({
        message: "Successful"
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/getpharmacybids", (req, res) => {
  Post.find({ "pharmacybids.pharmacyid": req.body.id })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/getalluserposts", (req, res) => {
  Post.find({ isactive: true })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/pharmacylisting", (req, res) => {
  let location = req.body.location;
  let fulfillmentmethod = req.body.fulfillmentmethod;
  Post.find({
    $or: [
      { city: { $regex: location, $options: "i" } },
      { deliveryoption: fulfillmentmethod }
    ]
  })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/pharmacypendingoffers", (req, res) => {
  Post.find({
    "pharmacybids.pharmacyid": req.body.pharmacyid,
    "pharmacybids.isdecline": false,
    isactive: true
  })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/pharmacyhistory", (req, res) => {
  Post.find({
    "pharmacybids.pharmacyid": req.body.pharmacyid,
    "pharmacybids.isdecline": false
  })
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(() => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

module.exports = router;
