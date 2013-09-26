var initialData = [
    { ProjectName: "Project 1", StartMoment: new Date(2013, 8, 1, 12, 0, 0 ),EndMoment: new Date(2013, 8, 5, 12, 0, 0 ), Tasks: [
        { TaskName: "Taak 1", StartMoment: new Date(2013, 8, 1, 12, 0 , 0 ), EndMoment: new Date(2013, 8, 1, 14, 0, 0 ), TeamName: "TeamName A", AssignedTo: "Jurjen" },
		{ TaskName: "Taak 2", StartMoment: new Date(2013, 8, 5, 9, 0, 0 ), EndMoment: new Date(2013, 8, 5, 12, 0,0 ), TeamName: "TeamName A", AssignedTo: "Jurjen" }
        ]
    },
    { ProjectName: "Project 2", StartMoment: new Date(2013, 8, 6, 12, 0, 0 ),EndMoment: new Date(2013, 8, 8, 16, 0, 0), Tasks: [
        { TaskName: "Taak A", StartMoment: new Date(2013, 8, 6, 12, 0, 0 ), EndMoment: new Date(2013, 8, 6, 18, 0, 0 ), TeamName: "TeamName B", AssignedTo: "Jurjen" },
		{ TaskName: "Taak B", StartMoment: new Date(2013, 8, 8, 8, 0, 0), EndMoment: new Date(2013, 8, 8, 16, 0, 0), TeamName: "TeamName B", AssignedTo: "Jurjen" }
        ]
    }
];


var koTaskModel =function (task){

	var self = this;
	
	self.TaskName= task.TaskName;
	self.StartMoment= ko.observable(new Date(task.StartMoment));
	self.EndMoment= ko.observable(new Date(task.EndMoment));			
	self.TeamName= task.TeamName;
	self.AssignedTo=ko.observable(task.AssignedTo);		

	
}

var koProjectModel = function(project){
	var self = this;
	
	self.ProjectName = project.ProjectName, 
	self.StartMoment = ko.observable(new Date(project.StartMoment)),
	self.EndMoment = ko.observable(new Date(project.EndMoment)),
	self.Tasks = ko.observableArray(
			ko.utils.arrayMap(project.Tasks, function(task){
				return new koTaskModel(task);
			}));			

}


var koProjectsModel = function(projects) {
    // Data
    var self = this;
	
	self.projects = ko.observableArray(
						ko.utils.arrayMap(projects, function(project) {
							return new koProjectModel(project);
						}));


	self.save = function() {
        self.lastSavedJson(
		JSON.stringify(ko.toJS(self.projects), null, 2));
		
		//var projTimes = "";
		//for(var p =0; p < self.projects().length; p++){
		//	projTimes += self.projects()[p].StartMoment().toLocaleString() + " - " + self.projects()[p].EndMoment().toLocaleString()	
		//}

		//self.lastSavedJson(projTimes);	
	};
	
	self.firstStartDate = function(){
		var startDate = new Date(self.projects()[0].StartMoment());
		
		for(var p =1; p < self.projects().length; p++){
			if(+startDate >= +self.projects()[p].StartMoment()){
				startDate = new Date(self.projects()[p].StartMoment());
			} 
		}
		
		return startDate;
	};
	
	self.lastEndDate = function(){
		var endDate = new Date(self.projects()[0].EndMoment());
		
		for(var p =1; p < self.projects().length; p++){
			if(+endDate <= +self.projects()[p].EndMoment()){
				endDate = new Date(self.projects()[p].EndMoment());
			} 
		}
		
		return endDate;
	};
	
    self.lastSavedJson = ko.observable("")
	
};