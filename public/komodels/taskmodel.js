function TaskModel(task){
	var self = this;
	
	self.Priority= task.Priority,
	self.Name = task.Name,
	self.TeamName = task.TeamName,
	self.ProjectName = task.ProjectName,
	self.AssignedTo = task.AssignedTo,
	self.StartedDate = task.StartDate,
	self.CompletionDate = task.CompletionDate
	
}


// We need to add a prootype to the date object
Date.prototype.addHours= function(h){
    var copiedDate = new Date(this.getTime());
    copiedDate.setHours(copiedDate.getHours()+h);
    return copiedDate;
}

// We need to add a prootype to the date object
Date.prototype.addMinutes= function(m){
    var copiedDate = new Date(this.getTime());
    copiedDate.setMinutes(copiedDate.getMinutes()+m);
    return copiedDate;
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
				 //console.log(ko.toJSON(data.tasks[i]));
				 self.tasks.push(new TaskModel(data.tasks[i]));
				 if( i > 20) return;
			}});
		
	}; 
	
	self.loadDummyTasks = function(){

		var taskNames =  ["Plan van aanpak","Mening ouder/jongere verwerkt",
						"Evaluatie rapportage", "Risico Taxatie", 
						"Intake gesprek slachtoffer", "Overleg behandelaars", 
						"Verwerken formulier", "Zaak analyse gedragwetenschapper"];
		var teamNames =  ["Team1","Team2","Administratie", "Buitendienst"];

		var projectNames =  ["ProjectA","ProjectB","ProjectC"];
		
		var teamMembers =  ["Jurjen","Michel","Luc", "Hans"];

		
		for (var index = 0; index < 20; index++) {
			
			var taskNameId = Math.floor((Math.random()*taskNames.length));
			var taskName = taskNames[taskNameId];
			
			var teamNameId = Math.floor(Math.random()*teamNames.length);
			var teamName = teamNames[teamNameId];	
	
			var projectNameId = Math.floor(Math.random()*projectNames.length);
			var projectName = projectNames[projectNameId];	
			
			var teamMemberId = Math.floor(Math.random()*teamMembers.length);
			var teamMember = teamMembers[teamMemberId];	
			
			
			var startedDay = Math.floor(Math.random()*10)+1;
			var startedDate = new Date(2013,8,startedDay,09,00,0);
			
			var minutesToAddList = [15, 30, 45];
			var minutesToAdd = minutesToAddList[Math.floor(Math.random()*3)];
			var hoursToAdd = Math.floor(Math.random()*3) + 1;
			var completionDate = new Date(2013,8,startedDay,09,00,0).addHours(hoursToAdd);
			
			completionDate = completionDate.addMinutes(minutesToAdd);

			var task = {
				Priority: index,
				Name : taskName,
				TeamName : teamName,
				ProjectName : projectName,
				AssignedTo : teamMember,
				StartDate: startedDate,
				CompletionDate : completionDate
			}
			
			console.log(task);
			
			self.tasks.push(new TaskModel(task));
		}
		  
	
		
	}; 
	
	
	
 

	
	
	self.loadDummyTasks();
}

