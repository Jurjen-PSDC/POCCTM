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
  },
  removeAllTasks: function(req, res){
	var self = this;
	var query = azure.TableQuery
      .select()
      .from(self.tasks.tableName);
	self.tasks.find(query, function itemsFound(err, items) {
		for(i=0; i < items.length; i++){
			console.log("removing task " + items[i].RowKey + " for table " + items[i].PartitionKey );
			self.tasks.deleteItem(items[i], function itemDeleted(err){
				if(err){
					throw err;
				}
			});
		}
		res.redirect('/alltasks');	
	  });
    }
}