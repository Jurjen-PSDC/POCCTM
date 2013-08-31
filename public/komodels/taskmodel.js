function TaskModel(name, groupId, projectId, customerId,  taskId, priority, supplyMoment, assignedTo){
	var self = this;
	self.name = name;
	self.groupId = groupId;
	self.customerId = customerId;
	self.completed = 0;
	self.projectId = projectId;
	self.taskId = taskId,
	self.priority = priority;
	self.supplyMoment = ko.observable(supplyMoment);
	self.assignedTo = assignedTo;
	self.reasonForDelay = "";
	
}

ko.bindingHandlers.draggableItem = {
	init: function (element){
			$(element).draggable({ 
			axis: "x", 
			containment: "parent",
			drag: function(){
				var offset = $(element).offset();
				var xPos = offset.left;
				$(element).find('span').text("x: " + xPos);
			}
		});
	}
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
	
	self.tasksStatic = ko.observableArray([
		new TaskModel("Plan van aanpak", "TEAM1", "Project1", "Klant1", 10000, 1, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Mening ouder/jongere verwerkt", "TEAM2", "ProjectB", "Klant1", 10001, 2, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Evaluatie rapportage", "TEAM2", "ProjectB", "Klant2", 10002, 3, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Risico Taxatie", "Deskundige", "ProjectB", "Klant2", 10003, 4, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Intake gesprek slachtoffer", "TEAM1", "ProjectA", "Klant2", 10004, 5, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Overleg behandelaars", "TEAM2", "ProjectA", "Klant2", 10005, 6, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Verwerken formulier", "Administratie", "ProjectB", "Klant2", 10006, 7, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Zaak analyse gedragwetenschapper", "TEAM1", "Project1", "Klant1", 10007, 8, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Plan van aanpak", "TEAM1", "Project1", "Klant1", 10000, 9, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Mening ouder/jongere verwerkt", "TEAM2", "ProjectB", "Klant1", 10001, 10, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Evaluatie rapportage", "TEAM2", "ProjectB", "Klant2", 10002, 11, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Risico Taxatie", "Deskundige", "ProjectB", "Klant2", 10003, 12, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Intake gesprek slachtoffer", "TEAM1", "ProjectA", "Klant2", 10004, 13, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Overleg behandelaars", "TEAM2", "ProjectA", "Klant2", 10005, 14, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Verwerken formulier", "Administratie", "ProjectB", "Klant2", 10006, 15, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Zaak analyse gedragwetenschapper", "TEAM1", "Project1", "Klant1", 10007, 16, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Plan van aanpak", "TEAM1", "Project1", "Klant1", 10000, 17, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Mening ouder/jongere verwerkt", "TEAM2", "ProjectB", "Klant1", 10001, 18, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Evaluatie rapportage", "TEAM2", "ProjectB", "Klant2", 10002, 19, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Risico Taxatie", "Deskundige", "ProjectB", "Klant2", 10003, 20, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Intake gesprek slachtoffer", "TEAM1", "ProjectA", "Klant2", 10004, 21, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Overleg behandelaars", "TEAM2", "ProjectA", "Klant2", 10005, 22, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Verwerken formulier", "Administratie", "ProjectB", "Klant2", 10006, 23, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Zaak analyse gedragwetenschapper", "TEAM1", "Project1", "Klant1", 10007, 24, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Plan van aanpak", "TEAM1", "Project1", "Klant1", 10000, 25, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Mening ouder/jongere verwerkt", "TEAM2", "ProjectB", "Klant1", 10001, 26, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Evaluatie rapportage", "TEAM2", "ProjectB", "Klant2", 10002, 27, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Risico Taxatie", "Deskundige", "ProjectB", "Klant2", 10003, 28, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Intake gesprek slachtoffer", "TEAM1", "ProjectA", "Klant2", 10004, 29, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Overleg behandelaars", "TEAM2", "ProjectA", "Klant2", 10005, 30, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Verwerken formulier", "Administratie", "ProjectB", "Klant2", 10006, 31, new Date(2013,8,14,12,00,0), "Jurjen"),
		new TaskModel("Zaak analyse gedragwetenschapper", "TEAM1", "Project1", "Klant1", 10007, 32, new Date(2013,8,14,12,00,0), "Jurjen")
	]);
	
	
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
		  $.getJSON("/alltasks", function(data){ 
			for (var i = 0; i < data.tasks.length; i++) {
				 self.tasks.push(data.tasks[i]);
			}});
		
	}; 
	self.loadTasks();
}

