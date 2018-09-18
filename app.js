var express = require('express');
var session = require('express-session');

var bodyParser = require('body-parser');
var ejs = require('ejs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Movie',function(err,db){
	if(err) throw err;
	console.log('mongoDB connect success');
});
global.db = mongoose.connection;
global.dbHandel = require('./app/db/dbHandel');
var app = express();

var port = process.env.PORT||8080


var log4js = require('log4js');
log4js.configure({
    appenders: {
        ruleConsole: {type: 'console'},
        ruleFile: {
            type: 'dateFile',
            filename: 'logs/server-',
            pattern: 'yyyy-MM-dd.log',
            maxLogSize: 10 * 1000 * 1000,
            numBackups: 3,
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {appenders: ['ruleConsole', 'ruleFile'], level: 'info'}
    }
}
);
var logger = log4js.getLogger('default');

app.engine(".html",ejs.__express);
app.set("view engine","html");//指定模版引擎ejs
app.set("views",__dirname+"/app/views");//指定模版位置

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/'));// 读取静态文件

app.use(session({
	resave:false,
	saveUninitialized:true,
    secret: 'secret',
    cookie:{ 
        maxAge: 1000*60*30
    }
}));

app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

require('./config/routes')(app);

var server = app.listen(port,function(){
		console.log("服务器启动成功！！")
	}
);

var io = require('socket.io')(server);

io.on('connection',function(client){
	client.on('join',function(nickname){
		client.nickname = nickname
		io.sockets.emit('announcement','系统',nickname+'加入聊天室！')
	})
	client.on('sendmessage',function(msg){
		client.broadcast.emit('sendmessage',client.nickname,msg)
	})
})

