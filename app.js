var express = require('express')
var app = express()
var bodyParser = require('body-parser') // post방식으로 값을 받아오려면 body-parser 모듈을 설치해야함
//bodyParser란 클라이언트 POST request data의 body로부터 파라미터를 편리하게 추출할수있는기
var router = require('./router/index')

// DATABASE SETTING (Google Cloud SQL)


app.use(express.static('public')) // public 경로 아래에 위치한 파일들을 모두 static으로 요청 받아옴 *중요*
app.use(bodyParser.json()) //json을 파싱
app.use(bodyParser.urlencoded({extended:true})) //자동으로 req에 body속성이 추가되고 저장된다. urls에 접근하고 싶다면 req.body.urls이다. 인코딩도 default로 UTF-8로 해준다 이벤트등록할필요가 없어짐.
//extended는 중첩된 객체표현을 허용할지 말지를 정하는것 객체 안에 객체를 파싱할수있게 하려면 true
//내부적으로 true를 하면 qs 모듈을 사용하고, false면 query-string 모듈을 사용한ㄷ.

app.use(router)

app.set('view engine', 'ejs') //ejs를 사용

app.listen(3000, function() {
  console.log("start@ on port 3000");
});
