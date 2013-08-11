var azure = require('azure')
  , async = require('async');
 
module.exports = TasksList;
 
function TasksList(tasks) {
  this.tasks = tasks;
}
 
TasksList.prototype = {
  showTasks: function(req, res) {
    self = this;
    var query = azure.TableQuery
      .select()
      .from(self.tasks.tableName);
      //.where('active eq ?', 'Yes');
    self.tasks.find(query, function itemsFound(err, items) {
      res.json({title: 'The tasks ', tasks: items});
    });
  },
 
   addTask: function(req,res) {
    var self = this;
    var item = req.body;
	console.log("Adding a task :" + item.name);
	 self.tasks.addItem(item, function itemAdded(err) {
      if(err) {
        throw err;
      }
      res.redirect('/');
    });
  }
}