var express=require('express');
var app=express();
const session = require("express-session");
app.use(express.static("bookshop"));
app.use(express.static("bookshop/css"));
app.use(express.static("bookshop/html"));

app.set('view engine','ejs');

app.use(session({
    secret: "y78887897",
    saveUninitialized: true,
    resave: true
}));


/* create database for stablish connection*/
var my=require("mysql");
var con= my.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'project'
});
con.connect(function(err){
    if(err)
        throw err;
    console.log("connect to mysql")
});
/*-------------------------------------*/


app.get("/login",function(req,res)
{
res.sendFile("./bookshop/html/login.html",{root:__dirname});
});

    app.get("/Register",function(req,res)
{
res.sendFile("./bookshop/html/register.html",{root:__dirname});
});
app.get("/index",function(req,res)
{
res.sendFile("./bookshop/html/index.html",{root:__dirname});
});
app.get("/contact",function(req,res)
{
res.sendFile("./bookshop/html/contact.html",{root:__dirname});
});

var bd=require('body-parser');
var ed=bd.urlencoded({extended:false}) 

app.use(function (req, res, next) {
  res.locals.aname = req.session.aname;
  res.locals.uname = req.session.uname;

  next();
});


app.post("/regprocess",ed,function(req,res)
{
    var a=req.body.N;
    var b=req.body.E;
    var c=req.body.P;
    var q="insert into users values('"+a+"','"+b+"','"+c+"')";
   con.query(q,function(err,result){
    if(err)
        throw err;
    res.send("you are successfully registered")
   }) ;

});

/*-----------------------------login-------------*/
app.post("/loginprocess",ed,function(req,res){
var a=req.body.E;
var b=req.body.P;
console.log(a);
console.log(b);
var q="select * from users where email='"+a+"'";
con.query(q,function(err,result){
    if(err)
        throw err;
    console.log(result);
    var L=result.length;
    if(L>0){
        var p=result[0].pwd;
        if(p==b)
            {
                req.session.uname=result[0].name;
                req.session.uemail=result[0].email;


                res.redirect("/books")
                 
                } 
        else
        res.send("Password is invalid");
    }
    else
    res.send("Email is invalid");
});    
});

app.listen(4000,function(req,res)
{
console.log("Project run on port no 4000");
});