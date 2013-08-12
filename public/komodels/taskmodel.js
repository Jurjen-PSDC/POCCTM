function TaskModel(name, start, finish){
	var self = this;
	self.name = name;
	self.completed = false;
	self.start = start;
	self.finish = finish;
}

function TaskListViewModel() {
    // Data
    var self = this;
	
	self.tasks = ko.observableArray();
	self.newTaskText = ko.observable();
	self.From = ko.observable();
	self.Duration = ko.observable();
    self.incompleteTasks = ko.computed(function() {
        return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.completed });
    });

	self.fromToList = new Array("0","1","2", "3", "4", "5", "6", "7", "8", "9");
	
	
    // Operations
    self.addTask = function() {
		var finish = parseInt(this.From()) + parseInt(this.Duration());
		var newModel = new TaskModel(this.newTaskText(), parseInt(this.From()), finish);
		self.tasks.push(newModel);
		self.newTaskText("");
		var taskData = ko.toJSON(newModel);
		$.ajax({
            url: '/addtask',
            type: 'post',
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (data) {
				console.log("added new task : ");
            },
            data: taskData
        });
	};
    self.removeTask = function(task) { self.tasks.remove(task) };
	
	self.loadTasks = function(){
		  $.get("/alltasks", {}, function(data){ 
			for (var i = 0; i < data.tasks.length; i++) {
				 self.tasks.push( new TaskModel(data.tasks[i].name , data.tasks[i].active));
			}});
		
	}; 
	self.loadTasks();
}

ko.applyBindings(new TaskListViewModel());