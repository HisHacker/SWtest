var express = require('express')
var app = express()
var router = express.Router();
var path = require('path')
var mysql = require('mysql'); //mysql 연동

var connection = mysql.createConnection({ //연동서버
  host     : '35.184.214.39',
  port     : 3306,
  user     : 'root',
  password : 'root',
  database : 'jsman'
});

connection.connect();

//router
router.get('/', function(req,res){ //join url만 넘어왔으면 자동으로 웹사이트의 localhost:3000/ 이하부분을 Get 하겠다라는 의미?
  console.log('get join url');
  res.sendFile(path.join(__dirname, '../../public/join.html'))
})

router.post('/', function(req,res){
  var body = req.body;
  var email = body.email;
  var name = body.name;
  var passwd = body.password


  var sql = {email : email, name : name, password : passwd}; //왼쪽 email은 DB의 필드값 오른쪽 email은 form 의 email 입력값
  var query = connection.query('insert into user set ?', sql, function(err,rows){
    if(err) throw err;
    else res.render('welcome.ejs', {'name' : name, 'id' : rows.insertId}) //welcome.ejs에서 <%= name %>부분을 이걸로 채워줌
  })
})


module.exports = router;
