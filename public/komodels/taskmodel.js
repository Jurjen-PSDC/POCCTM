function TaskModel(name, completed){
	var self = this;
	self.name = name;
	self.completed = completed;
}

function TaskListViewModel() {
    // Data
    var self = this;
	
	self.tasks = ko.observableArray();
	
    self.newTaskText = ko.observable();
    self.incompleteTasks = ko.computed(function() {
        return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.completed });
    });

    // Operations
    self.addTask = function() {
		var newModel = new TaskModel(this.newTaskText(), false);
		var taskData = ko.toJSON(newModel);
		$.ajax({
            url: '/addtask',
            type: 'post',
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (data) {
				self.newTaskText("");
				//self.tasks.push(new TaskModel(this.newTaskText(), false));
				console.log("added new task");
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