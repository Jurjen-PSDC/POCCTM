
/**
 * Module dependencies.
 */
var azure = require('azure');
var tableName = 'systems'
  , partitionKey = 'partition'
  , accountName = 'psdc'
  , accountKey = 'LoV+o34kQanMFtVR23VoYalR43QhMpL77LJDNZDdEWaGmk/yQ+AVVOPyOT7NUtp0gqk0ZilU/rlMrFQHe0UyPw==';
 
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');
 
var app = express();
 
app.configure(function(){
  app.set('port', process.env.PORT || 1337);
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
 
app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res)
{
    res.render('projects-templates.html');
}); 
 
app.listen(process.env.port || 1337);