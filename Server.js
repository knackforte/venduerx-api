const express = require("express");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
const transaction = require("mongoose-transactions");
app.use(bodyparser.json());

const database = require("./keys").mongoURI;
const User = require("./Routes/user");
const Post = require("./Routes/post");

const port = 3002;
app.listen(port, () => {
  console.log("Server is litening on port :" + port);
});

mongoose
  .connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    data => {
      console.log("Database Connected");
    },
    err => {
      console.log("Error generated. Database not connected." + err);
    }
  );

app.use("/api", User);
app.use("/api", Post);
