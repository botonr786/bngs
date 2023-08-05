const express = require("express");
const path = require("path");
const cors = require("cors");
var bodyParser = require("body-parser");
var logger = require("morgan");
require("./DB/connect");
const fs = require('fs')
const superAdmin=require("./router/superAdmin.router")
const PORT = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost'
const autocall = require("./cron.service");
const app = express();
console.log(host)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

autocall.croninit();
app.use("/api/super", superAdmin);

app.listen(PORT, function () {
  console.log("server is running");
});

