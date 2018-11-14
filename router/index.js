//controller

var express = require('express')
var app = express()
var router = express.Router();
var path = require('path')
var main = require('./main/main')
var email = require('./email/email')
var join = require('./join/index')

router.get('/', function(req,res){ //http://localhost:3000/

  res.sendFile(path.join(__dirname, "../public/1.html"))
})

router.post('/next', function(req,res){
  res.sendFile(path.join(__dirname, "../public/next.html"))
})

router.post('/comp', function(req,res){
  res.sendFile(path.join(__dirname, "../public/complete1.html"))
})



router.use('/main', main) //아래 main.js를 사용하겠다
router.use('/email', email) //위에 email.js를 사용하겠다
router.use('/join', join)

module.exports = router;
