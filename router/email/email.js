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
router.post('/form', function(req,res){ //form.html에 form부분 action에 email_post를 지정하여 이값을 넘겨줌
  console.log(req.body.email) //form.html의 입력값을 출력
  //res.send("post response") //post를 하면(제출) email_post라는 페이지로 post response 문구를 보냄
  //res.send("<h1>Welcome!"+"<br>ID: " + req.body.email + "</h1>") //입력한값을 email_post 홈페이지에 send한다
  res.render('email.ejs', {'email' : req.body.email}) //view에 email.ejs에 입력값을 <%=email%>부분에 넣어줌 + 파일이름만 입력해주어도 파일을 알아서 랜더링해준다 (view 엔진의 특성)
})

router.post('/ajax', function(req, res){
  var email = req.body.email; //html에서 적은부분을 email에 담는다
  var responseData = {}; //responseData에 배열을 쓴다고 정의

  var query = connection.query('select name from user where email="' + email +'"', function(err, rows){
    if(err) throw err;
    if(rows[0]) { // 셀렉트값이면
      console.log(rows[0])
      responseData.result = "ok"; //응답값의 결과가 ok면 rows[0].name 즉 셀렉트값의 이름 JBJ를 응답값의 이름에 넣는다
      responseData.name = rows[0].name;
    } else {
      responseData.result = "none";
      responseData.name = "";
    }
    res.json(responseData) //결과값의 배열을 json형태로 반환후 출력
  })
})

module.exports = router;
