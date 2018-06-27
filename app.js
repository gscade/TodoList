var LocalStorage = require('node-localstorage').LocalStorage;
var sessionStorage = require('sessionstorage');
var express = require('express');
var app = express(); 
var bodyParser = require('body-parser');
localStorage = new LocalStorage('./');
app.use(express.static('public'));

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/views/" + "login.html" );
})

app.get('/register', function (req, res) {
        res.sendFile( __dirname + "/views/" + "register.html" );
    })
app.get('/login', function (req, res) {
        res.sendFile( __dirname + "/views/" + "login.html" );
    })
app.get('/index', function(req, res) {
         const UserInfoState = sessionStorage.getItem('userState');
         if (UserInfoState) {
            res.sendFile(__dirname + "/views/" + "index.html");
            // res.render('index', {
            //      name: JSON.parse(sessionStorage.getItem('userState')).name
            // });
          } 
        else {
            res.redirect('/login');
         }
    })
    app.get('/logout', function(req, res) {
        sessionStorage.removeItem('userState');
        res.sendFile(__dirname + "/views/" + "login.html");
    })
app.post('/register_post', urlencodedParser, function(req, res) {
    var name = req.body.n;
    var passwd1 = req.body.p1;
    var passwd2 = req.body.p2;
    var dirAcc = JSON.parse(localStorage.getItem('users'));

    if (passwd1 === passwd2) {
        if (dirAcc) { //有任何用户文件
            let existSate = false;
            for (let i = 0; i < dirAcc.length; i++) {
                if (dirAcc[i].name === name) {
                    existSate = true;
                }
            }
            if (existSate) { //用户存在
                res.redirect('/register');
                console.log('user already exist');
            } else { //用户不存在 创建
                let user = {
                    name: name,
                    passwd: passwd1
                };
                dirAcc.push(user);
                localStorage.setItem('users', JSON.stringify(dirAcc));
                res.redirect('/login');
                console.log(name + ' register success');
            }
        } else { //无用户文件
            let user = [{
                name: name,
                passwd: passwd1
            }]
            localStorage.setItem('users', JSON.stringify(user));
            res.redirect('/login');
            console.log(name + ' register success');
        }
    } else {
        res.redirect('/register');
        console.log('passwd not same');
    }
})

app.get('/user',function(req,res){
    var username=JSON.parse(sessionStorage.getItem('userState')).name;
    res.send(username);
})


app.post('/login_post', urlencodedParser, function(req, res) {

    var name = req.body.name;
    var passwd = req.body.p;
    var dirAcc = JSON.parse(localStorage.getItem('users'));
    if (dirAcc) {
        let id = -1;
        for (let i = 0; i < dirAcc.length; i++) {
            if (dirAcc[i].name === name) {
                id = i;
            }
        }
        if (id === -1) { //无此用户
            res.redirect('/login');
            console.log('have no this user:' + name);
        } else if (passwd === dirAcc[id].passwd) { //密码正确 存储session
            const UserInfoNow = {
                name: name,
                passwd: passwd
            }
            sessionStorage.setItem('userState', JSON.stringify(UserInfoNow));
            res.redirect('/index');
            console.log(name + ' login success');
        } else {
            res.redirect('/login');
            console.log('password not right');
        }
    } else { //无用户库 注册
        res.redirect('/register');
        console.log('have no user,register');
    }
    res.end();
})

 
var server = app.listen(2333, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("访问地址为 http://%s:%s", host, port)
 
})
