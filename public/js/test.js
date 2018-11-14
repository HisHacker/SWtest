window.onload = function(){
  //document.getElementById("board_list_select").value = "All";
}

function clickLogin() {

  var f = document.createElement("form");
  f.setAttribute("method", "get");
  f.setAttribute("action", "/join");
  document.body.appendChild(f);

  f.submit();

}

function clickRegister() {

  var f = document.createElement("form");
  f.setAttribute("method", "get");
  f.setAttribute("action", "/sign_up");
  document.body.appendChild(f);

  f.submit();

}
