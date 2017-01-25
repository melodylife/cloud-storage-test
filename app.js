var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var index = require('./routes/index');
var users = require('./routes/users');
var google = require('googleapis');
var request = require('request');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(3000 , function() {
  console.log("This is is a test");
  var credentials = require('./source/credentials/readClouStorage-92ec270b46f3.json');
  console.log('This is the keys ' + credentials.toString());
  var jwtClient = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/devstorage.read_only'],
        null
      );
  jwtClient.authorize(function(err , token) {
  
    if(!err){
      console.log(token);
      var access_token = token.access_token;
    }
    else{
      console.log("Error occurs " + err);
    }
    var options = {
      url: 'https://www.googleapis.com/storage/v1/b/test_changchangyo',
      headers: {
        'Authorization': 'Bearer ' + access_token 
      }
    };

    request(options , function(error, response, body) {
      if(!error && (200 == response.statusCode)){
        console.log(body);
      }
      else{
        console.log('Failed to request any bucket ' + response.statusCode);
      }
    });
  });

});

module.exports = app;
