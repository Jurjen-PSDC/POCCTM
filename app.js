
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
 
var TasksList = require('./routes/taskslist');
var Tasks = require('./models/tasks.js');
var tasks = new Tasks(
    azure.createTableService(accountName, accountKey)
    , tableName
    , partitionKey);
var tasksList = new TasksList(tasks);

app.get('/', function (req, res)
{
    res.render('index.html');
}); 

app.get('/custom-timebox', function (req, res)
{
    res.render('custom-timebox.html');
}); 
 
app.get('/alltasks', tasksList.showTasks.bind(tasksList));
app.post('/addtask', tasksList.addTask.bind(tasksList));
 
app.listen(process.env.port || 1337);