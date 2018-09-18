exports.checkuser = function(req,res){
	var name = req.query.username;
	var password = req.query.pwd;
	var User = global.dbHandel.getModel('user');
	User.findOne({name:name},function(err,doc){
		if(err){
			res.sendStatus(500);
			console.log(err);
		}else if(!doc){
			req.session.error = "用户名不存在！"
			res.sendStatus(500);
		}else{
			if(doc.password !== password){
				req.session.error = "密码错误";
                res.sendStatus(500);
			}else{
				req.session.user = doc;
                res.redirect("index/0/1");
			}
		}
	})
}

exports.checksession = function(req,res,next){
	if(!req.session.user){
		req.session.error = "请先登录！";
		res.redirect('/login');
	}else{
		next();
	}
}



exports.logout = function(req,res){
	req.session.user = null;
    req.session.error = null;
    res.redirect("/login");
}

exports.signup = function(req,res){
	var username = req.query.username;
	var password = req.query.password;
	var User = global.dbHandel.getModel('user');
	User.findOne({name:username},function(err,doc){
		if(err){
			res.sendStatus(500);
			console.log(err);
		}else if(doc){
			// console.log(doc);
			req.session.error = '用户名已存在！';
			res.sendStatus(500);
			console.log('用户名已存在！');
		}else{
			User.create({name:username,password:password},function(err,doc){
				if(err){
					res.sendStatus(500);
					console.log(err);
				}else{
					req.session.error = '用户创建成功！';
					res.redirect('/login');
				}
			})
		}
	})
}

