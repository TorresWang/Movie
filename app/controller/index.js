exports.rendIndex = function(req,res){
	// console.log(req.results)
	var moviecates = new Array();
	var countrys = new Array();
	var years = new Array();
	req.movies.forEach(function(movie){
		moviecates.indexOf(movie.moviecate)<0?moviecates.push(movie.moviecate):"";
		countrys.indexOf(movie.country)<0?countrys.push(movie.country):"";
		years.indexOf(movie.year)<0?years.push(movie.year):"";
	})
	res.render("index",{
		username:req.session.user.name,
		movies:req.results,
		moviecates:moviecates,
		countrys:countrys,
		years:years.sort(),
		pagesize:req.pagesize,
		counts:req.counts,
		currentpage:req.currentpage,
		totalpage:req.totalpage,
		c:req.c,
		msg:req.query.msg,
		nav:"prefer"
	})
}