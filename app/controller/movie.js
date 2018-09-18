var path = require("path");
var fs = require("fs");

exports.movielist = function(req,res,next){
	var Movie = global.dbHandel.getModel('movie');
	Movie.find({},function(err,movies){
		if(err){
			console.log(err);
			res.sendStatus(500);
		}else if(!movies){
			console.log("无符合要求的文档！");
			res.sendStatus(500);
		}else{
			req.movies = movies;
			req.results = movies;
			next();
		}
	})
}

exports.moviecatelist = function(req,res,next){
	var moviecate = global.dbHandel.getModel('moviecate');
	moviecate.find({},function(err,moviecates){
		if(err){
			console.log(err);
			res.sendStatus(500);
		}else if(!moviecates){
			res.sendStatus(500);
		}else{
			req.moviecates = moviecates;
			next();
		}
	})
}

exports.searchmovies = function(req,res,next){
	if(parseInt(req.params.c) == 3){
		var msg = req.query.msg;
		var movie = global.dbHandel.getModel('movie');
		movie.find({movieName: {$regex: msg, $options:'i'}},function(err,movies){
			if(err){
				res.sendStatus(500)
			}else if(!movies){
				res.sendStatus(500)
			}else{
				req.results = movies;
				next();
			}
		})
	}else{
		next();
	}
}

exports.category = function(req,res,next){
	var c = parseInt(req.params.c);
	if(c<0){
		var msg = req.query.msg;
		var movie = global.dbHandel.getModel('movie');
		movie.find(c==-1?{moviecate:msg}:c==-2?{country:msg}:{year:msg},function(err,movies){
			if(err){
				res.sendStatus(500)
			}else if(!movies){
				res.sendStatus(500)
			}else{
				req.results = movies;
				next();
			}
		})
	}else{
		next()
	}
	
}

exports.pagination = function(req,res,next){
	var c = parseInt(req.params.c);
	var page = parseInt(req.params.p);
	if(!page){
		page = 1;
	}
	
	var pagesize = 5;
	var counts = req.results.length;
	var index = (page-1) * pagesize;
	var results = req.results.slice(index,index+pagesize);
	var totalpage;
	if(counts%pagesize==0){
		totalpage = counts/pagesize;
	}else{
		totalpage = Math.ceil(counts/pagesize);
	}
	req.results = results;
	req.pagesize = pagesize;
	req.counts = counts;
	req.currentpage = page;
	req.totalpage = totalpage;
	req.c = c;
	next();
}

exports.rendmovieinfo = function(req,res){
	res.render("movieinfo",{
		movies:req.results,
		moviecates:req.moviecates,
		pagesize:req.pagesize,
		counts:req.counts,
		currentpage:req.currentpage,
		totalpage:req.totalpage,
	})
}

exports.uploadfile = function(req,res,next){
	var file = req.files.uploadPoster;
	var filepath = file.path;
	var originalFilename = file.originalFilename
	if(originalFilename){
		fs.readFile(filepath,function(err,data){
			var timestamp = Date.now();
			var type = file.type.split('/')[1];
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname,'../../public/upload/'
							+ poster );
			fs.writeFile(newPath,data,function(err){
				console.log("uploadfile:"+poster)
				req.poster = poster
				next();
			})
		})
	}else{
		next();
	}
	
}

exports.create = function(req,res){
	var movieid = req.body.movieID;
	var moviename = req.body.movieName;
	var moviecate = req.body.moviecate;
	var country = req.body.country;
	var year = req.body.year;
	var time = req.body.time;
	var introduce = req.body.introduce;
	var Movie = global.dbHandel.getModel('movie');
	var posterurl = req.body.posterurl;
	if(req.poster){
		posterurl = req.poster;
	}

	Movie.findOne({movieID:movieid},function(err,doc){
		if(err){
			res.sendStatus(500);
			console.log(err);
		}else if(doc){
			req.session.error = '该电影ID已存在！';
			res.sendStatus(500);
			console.log('该电影ID已存在！')
		}else{
			Movie.create({
				movieID:movieid,
				movieName:moviename,
				moviecate:moviecate,
				country:country,
				year:year,
				time:time,
				introduce:introduce,
				poster:posterurl
			},function(err,doc){
				if(err){
					res.sendStatus(500);
					console.log(err);
				}else{
					req.session.error = '电影添加成功！';
					res.redirect('/movieinfo/1');
					console.log('电影添加成功！')
				}
			})
		}
	})
}

exports.addmoviecate = function(req,res){
	var moviecatename = req.query.moviecatename;
	var moviecate = global.dbHandel.getModel('moviecate');
	moviecate.findOne({moviecatename:moviecatename},function(err,doc){
		if(err){
			res.sendStatus(500);
		}else if(doc){
			req.session.error = '该电影类型已存在！'
			res.sendStatus(500);
		}else{
			moviecate.create({
				moviecatename:moviecatename
			},function(err,doc){
				if(err){
					res.sendStatus(500);
					console.log(err);
				}else{
					res.redirect('/movieinfo/1');
					console.log('电影类型添加成功！')
				}	
			})
		}
	})
}

exports.delete = function(req,res){
	var movieid = req.params.id;
	var Movie = global.dbHandel.getModel('movie');
	Movie.deleteOne({movieID:movieid},function(err,doc){
		if(err){
			res.sendStatus(500);
			console.log(err);
		}else if(!doc){
			req.session.error = '该电影不存在！';
			res.sendStatus(500);
			console.log('该电影不存在！')
		}else{
			res.redirect('/movieinfo/1');
			console.log('电影删除成功！')
		}
	})
}

exports.deletecate = function(req,res){
	var moviecatename = req.query.msg;
	var moviecate = global.dbHandel.getModel('moviecate');
	moviecate.deleteOne({moviecatename:moviecatename},function(err,doc){
		if(err){
			res.sendStatus(500);
			console.log(err);
		}else if(!doc){
			req.session.error = '该电影类型不存在！';
			res.sendStatus(500);
			console.log('该电影类型不存在！')
		}else{
			res.redirect('/movieinfo/1');
			console.log('电影类型删除成功！')
		}
	})
}

