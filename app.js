var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var routes  = require('./routes/index');
var aop = require('./routes/aop/aop');
var auth = require('./routes/api/auth');
var department = require('./routes/api/department');
var employee = require('./routes/api/employee');
var position = require('./routes/api/position');

var app = express();

app.use(express.static(path.join(__dirname, 'public/app')));
app.use('/', routes);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var i=0;
app.use(function(req, res, next) {

    i++;
    if (req.path.indexOf('/api')>=0){
        // res.send('server text');
        // console.log('app.js/api拦截,第'+i+'次：'+req.url);
        next();
    }else {
        res.sendfile('public/app/index.html');
    }
});
app.use('',aop);
app.use('/api/auth', auth);
app.use('/api/department', department);
app.use('/api/employee', employee);
app.use('/api/position', position);

// catch 404 and forward to error handler


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
// http.createServer(app).listen(8088);

module.exports = app;
