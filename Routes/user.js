const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Transaction = require("mongoose-transactions");
const transaction = new Transaction();
const User = require("../Models/User");
const mongoose = require("mongoose");
const Post = require("../Models/Post");
const UserBid = require("../Models/UserBid");
//const Skill = require("../Models/Skill");
const Review = require("../Models/Review");
const UserDetails = require("../Models/UserDetails");
const Pharmacy = require("../Models/Pharmacy");
const SkillUpdate = require("../Models/Skill");
router.use(cors());
router.get("/help", (req, res) => {
  res.json({
    message: "Successfull"
  });
});
router.post("/signup", async (req, res) => {
  // console.log(req);

  async function start() {
    try {
      console.log("Entered Try Block");

      if (req.body.usertype === "user") {
        //previous
        const userDetailsObj = {
          firstname: req.body.firstname,
          lastname: req.body.lastname
        };
        const userObj = new User({
          usertype: req.body.usertype,
          email: req.body.email,
          password: req.body.password,
          streetaddress: req.body.streetaddress,
          state: req.body.state,
          city: req.body.city,
          zipcode: req.body.zipcode,
          userdetails: userDetailsObj
        });
        await userObj.save();
        // if (req.body.usertype === "user") {
        //   //previous
        //   const userDetailsObj = new UserDetails({
        //     userid: userObj._id,
        //     firstname: req.body.firstname,
        //     lastname: req.body.lastname
        //   });
        //await userDetailsObj.save();
      } else if (req.body.usertype === "pharmacy") {
        const pharmacyDetailsObj = {
          storename: req.body.storename,
          staffname: req.body.staffname,
          about: req.body.about,
          skillname: req.body.skillname
        };

        const userObj = new User({
          usertype: req.body.usertype,
          email: req.body.email,
          password: req.body.password,
          streetaddress: req.body.streetaddress,
          state: req.body.state,
          city: req.body.city,
          zipcode: req.body.zipcode,
          userdetails: pharmacyDetailsObj
        });
        await userObj.save();
      }
      const final = await transaction.run();
      return res.status(200).json({
        message: "success"
      });
    } catch (error) {
      console.log("Entered Catch Block");
      const rollbackobj = await transaction.rollback().catch(err => {
        return res.status(400).json({
          message: "fail"
        });
      });

      transaction.clean();
    }
  }
  start();
});

router.post("/api/login", token, (req, res) => {
  console.log('Hello login')
  jwt.verify(req.token, "vendueRX", (err, data) => {
    if (err) {
      res.status(400).json({ message: "Invalid Token" });
    } else {
      res.status(200).json({
        message: "token Validated",
        data
      });
    }
  });
});

function token(req, res, next) {
  const bearerheader = req.headers["authorization"];

  if (typeof bearerheader !== "undefined") {
    const bearer = bearerheader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    return res.status(400).json({
      message: "fail"
    });
  }
}

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email, password: req.body.password }).then(
    data => {
      if (data === null) {
        return res.status(400).json({
          message: "Wrong Email Or password"
        });
      } else {
        jwt.sign({ data }, "vendueRX", (err, token) => {
          if (err) {
            return res.status(400).json({
              message: "fail"
            });
          } else {
            return res.status(200).json({
              message: "success",
              token,
              data
            });
          }
        });
      }
    }
  );
});

router.post("/updateuser", (req, res) => {
  let userType = req.body.usertype;
  async function start() {
    try {
      if (userType === "user") {
        const userDetailsObj = {
          firstname: req.body.firstname,
          lastname: req.body.lastname
        };

        await User.findOneAndUpdate(
          {
            _id: req.body.userid
          },
          {
            email: req.body.email,
            streetaddress: req.body.streetaddress,
            state: req.body.state,
            city: req.body.city,
            zipcode: req.body.zipcode,
            userdetails: userDetailsObj
          }
        );
      } else if (userType === "pharmacy") {
        const pharmacyDetailsObj = {
          storename: req.body.storename,
          staffname: req.body.staffname,
          about: req.body.about,
          skillname: req.body.skillname
        };

        await User.findOneAndUpdate(
          {
            _id: req.body.userid
          },
          {
            email: req.body.email,
            streetaddress: req.body.streetaddress,
            state: req.body.state,
            city: req.body.city,
            zipcode: req.body.zipcode,
            userdetails: pharmacyDetailsObj
          }
        );
      } else {
        return res.status(400).json({
          message: "Invalid User Type"
        });
      }
      return res.status(200).json({
        message: "success"
      });
    } catch (error) {
      const rollbackobj = await transaction.rollback().catch(err => {
        return res.status(400).json({
          message: "fail"
        });
      });

      transaction.clean();
    }
  }
  start();
});
router.post("/updatepassword", (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.body.id,
      password: req.body.oldpassword
    },
    {
      password: req.body.newpassword
    }
  )
    .then(data => {
      if (data !== null) {
        return res.status(200).json({
          message: "success"
        });
      } else {
        return res.status(400).json({
          message: "Old Password do not match."
        });
      }
    })
    .catch(err => {
      return res.status(400).json({
        message: "Old Password do not match."
      });
    });
});

router.post("/review", (req, res) => {
  const userReview = {
    createdby: req.body.userid,
    pharmacyid: req.body.pharmacyid,
    text: req.body.text,
    rating: req.body.rating
  };
  User.findOneAndUpdate(
    { _id: req.body.pharmacyid },
    { $push: { reviews: userReview } }
  )
    .then(pharmacy => {
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
/////////////////////////////Getter Functions////////////////////////////////////////

router.post("/getdata", (req, res) => {
  Pharmacy.find((err, data) => { })
    .populate("userid")
    .exec(function (err, userObj) {
      if (err) {
        return res.status(400).json({
          message: "fail"
        });
      }
      return res.status(200).json({
        userObj
      });
    });
});

router.post("/getuserbyid", (req, res) => {
  async function start() {
    try {
      await User.findById({ _id: req.body.id }).then(data => {
        return res.status(200).json({
          data
        });
      });
    } catch (error) {
      const rollbackobj = await transaction.rollback().catch(err => {
        return res.status(400).json({
          message: "fail"
        });
      });

      transaction.clean();
    }
  }
  start();
});

router.post("/getpharmacybyid", (req, res) => {
  async function start() {
    try {
      await User.findById({ _id: req.body.id })
        .populate("reviews.createdby")
        .then(data => {
          return res.status(200).json({
            data
          });
        });
    } catch (error) {
      const rollbackobj = await transaction.rollback().catch(err => {
        return res.status(400).json({
          message: "fail"
        });
      });

      transaction.clean();
    }
  }
  start();
});

router.post("/getuserposts", (req, res) => {
  Post.find({ createdby: req.body.id })
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

router.post("/getpostbyid", (req, res) => {
  Post.find({ _id: req.body.id })
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

router.post("/getnumberofbidsbypharmacyid", (req, res) => {
  Post.find({ "pharmacybids.pharmacyid": req.body.pharmacyid })
    .then(data => {
      return res.status(200).json(data.length);
    })
    .catch(err => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

router.post("/getnumberoffulfilledbypharmacyid", (req, res) => {
  Post.find({ "acceptedoffer.pharmacyid": req.body.pharmacyid })
    .then(data => {
      return res.status(200).json(data.length);
    })
    .catch(err => {
      return res.status(400).json({
        message: "fail"
      });
    });
});

module.exports = router;
