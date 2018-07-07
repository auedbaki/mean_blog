var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
var validator = require('express-validator');
const config = require('./config/database');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var blogRouter = require('./routes/blog');
var cors = require('cors');
var app = express();
mongoose.Promise = global.Promise;
mongoose.connect(config.uri,err=>{
  if(err){
    console.log('Could not connect to Database ',err);
  }
  else
    console.log('Succesfully Connected to Database: '+config.db);
});

// view engine setup
app.engine('.hbs',expressHbs({defaultLayout:'layout',extname:'.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
var corsOptions = {
  origin:'http://example.com',
  optionsSuccessStatus:200
}
app.use(cors({  origin: 'http://localhost:4200/'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname+'/client/dist/'));

app.use('/api/auth', authRouter);
app.use('/api/blog', blogRouter);


app.get('*', function(req, res, next) {
  res.status(200).sendFile(path.join(__dirname,'/public/index.html'));
});

/* GET home page. */

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
