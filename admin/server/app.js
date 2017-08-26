var express = require('express');
var session = require('express-session');

var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db = require('./db.js');

var routes = require('./routes/index');

var user = require('./controller/user');

var app = express();

var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//静态文件目录
app.use(express.static(path.join(__dirname, '../public')));

app.get('/login', function(req, res, next) {
	if (session.userid) {
       res.redirect('/home');
	}
	else {
		res.sendfile(path.join(__dirname, '../public/index.html')); // 发送静态文件
	}
});

app.get('/toLogin', user.toLogin);

// app.use(function (req, res, next) {
//     if (session.userid) {
//         next();
//     } else {
//        	res.redirect('/login');
//     }
// })

app.use('/', routes);

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;