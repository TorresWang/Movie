var mongoose = require('mongoose');


// db.on('error', function(error){
// console.log(error);
// });

// db.on('open', function(error){
// console.log(error);


var models = require('./models');
var Schema = mongoose.Schema;
for(var m in models){
	mongoose.model(m,new Schema(models[m]),m);
}
module.exports = {
	getModel:function(type){
		return _getModel(type);
	}
};

var _getModel = function(type){
	return mongoose.model(type)
}