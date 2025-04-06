var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const oneDay = 86400000;
  res.cookie("name", "admin", {maxAge: oneDay}).send("cookies");
  res.render("home", { title: "Express", testJSON: { name: "test" }, login: login });
});

module.exports = router;
