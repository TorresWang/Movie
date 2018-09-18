exports.detail = function(req,res){
	var id = req.params.id;
	var Movie = global.dbHandel.getModel('movie');
	Movie.findOne({movieID:id},function(err,doc){
		if(err){
			res.sendStatus(500);
			console.log(err);
		}else if(!doc){
			res.sendStatus(500);
			console.log('不存在该电影ID')
		}else{
			res.render("detail",{
				moviename:doc.movieName,
				moviecate:doc.moviecate,
				country:doc.country,
				year:doc.year,
				time:doc.time,
				introduce:doc.introduce
			})
		}
	})
}