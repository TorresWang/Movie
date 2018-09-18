var https = require("https");
var fs = require("fs");
var cheerio = require("cheerio");
var request = require("request");

var i=0;
var url = "https://movie.douban.com/";
var results = [];
exports.getResults= function(req,res,next){
	https.get(url,function(res){
		var html = '';
		res.setEncoding('utf-8');
		res.on('data',function(chunk){
			html += chunk;
		});
		res.on('end',function(){
			var $ = cheerio.load(html);
			//获取电影名称
			$('.ui-slide-item').each(function(index,element){
				i++;
				var result = {
					title:$(element).attr('data-title'),
					rate:$(element).find('.subject-rate').html(),
					image_url:$(element).find('img').attr('src')
				};
				results.push(result);
			});
			req.movies = results;
			next();
		});
	})	
}

exports.fetch = function(req,res){
	res.render("index",{
		username:req.session.user.name,
		movies:req.movies,
		nav:"playing"
	});	
}

