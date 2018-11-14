var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')

router.get('/', function(req,res){ //http://localhost:3000/main
  res.sendFile(__dirname + "/public/main.html")
});

module.exports = router;
