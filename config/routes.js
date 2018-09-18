var multipart = require("connect-multiparty");
var User = require("../app/controller/user.js");
var Movie = require("../app/controller/movie.js");
var Detail = require("../app/controller/detail.js");
var Index = require("../app/controller/index.js");
var Playing = require("../app/controller/playing.js");

var multipartMiddleware = multipart();
// app.use(multiparty({uploadDir:'./public/upload' }));//设置上传文件存放的地址。
module.exports = function(app){
	app.get("/admin",function(req,res){
		res.render("admin",{

		});
	})

	app.get("/userinfo",function(req,res){
		res.render("userinfo",{

		});
	})

	app.get("/default",function(req,res){
		res.render("default",{

		});
	})

	app.get("/login",function(req,res){
		res.render("login",{

		})
	})
	app.get("/regist",function(req,res){
		res.render("regist",{

		})
	})
	app.get("/",function(req,res){
		res.redirect("/index/0/1");
	})
	app.get("/index/:c/:p",User.checksession,Movie.movielist,Movie.searchmovies,Movie.category,Movie.pagination,Index.rendIndex);
	app.get("/logout",User.logout);
	app.get("/checkuser",User.checkuser);
	app.get("/signup",User.signup);
	app.get("/movieinfo/moviecatelist",Movie.moviecatelist);
	app.get("/movieinfo/:p",Movie.movielist,Movie.moviecatelist,Movie.pagination,Movie.rendmovieinfo);
	app.post("/createMovie",multipartMiddleware,Movie.uploadfile,Movie.create);
	app.get('/addmoviecate',Movie.addmoviecate);
	app.get("/delete/:id",Movie.delete);
	app.get("/deletemoviecate",Movie.deletecate);
	app.get("/detail/:id",Detail.detail);
	app.get("/playing",User.checksession,Playing.getResults,Playing.fetch);
}