ko.extenders.date = function(target, format) {
	    return ko.computed({
	        read: function() {
	            var value = target();
	            if(typeof value === "string") {
	                value = new Date(value);                
	            }
	            
	            format = typeof format === "string" ? format: undefined;
	            value = value.toLocaleString();
	            
	            return value;        
	        },
	        write: target
	    });
};


ko.bindingHandlers.headerTimeLine = {
	init: function(element, accessor){
				
		var projectModel = accessor();
		var startDate = new Date(projectModel.firstStartDate());
		var endDate = new Date(projectModel.lastEndDate());
				
		// Create the JSON data table
		var data = [
			{
				start: startDate,
				end : endDate,
				content : "",
				className : 'ctm-box-header',
				type : "range",
				'ctmItemType' : 'ctm-header'			
			}
		];

		// specify options
		var options = {
			start : startDate,
			end : endDate,
			width:  timelinewidth,
			height: timelineHeaderheigth,
			editable: false,   // enable dragging and editing events
			style: "range",
			showMajorLabels : false,
			showMinorLabels : false,
			scale: projectModel.Scale,
			step: projectModel.Step
		};
			
		var timeline = new links.Timeline(element);
		function onRangeChanged(properties) {
				updateRanges(properties.start, properties.end);
		}

		// attach an event listener using the links events handler
		links.events.addListener(timeline, 'rangechange', onRangeChanged);
		timelines.push(timeline);
		// Draw our timeline with the created data and options
		timeline.draw(data, options);
	}
}
	
	
ko.bindingHandlers.projectTimeLine = {

	init: function(element, accessor){
		var projectModel = accessor();
		
		// Create the JSON data table
		var data = [
			{
				'start': new Date(projectModel.StartMoment()),
				'end' : new Date(projectModel.EndMoment()),
				'content' : "",
				'className' : 'ctm-box-project',
				'type' : "range",
				'ctmItemType' : 'ctm-project'			
			}
		];

		// specify options
		var options = {
			start : new Date(projectModel.StartMoment()),
			end : new Date(projectModel.EndMoment()),
			width:  timelinewidth,
			height: timelineheigth,
			editable: false,   // enable dragging and editing events
			style: "range",
			showMajorLabels : true,
			showMinorLabels : true,
			scale: projectModel.Scale,
			step: projectModel.Step
		};
		
		var timeline = new links.Timeline(element);
		function onRangeChanged(properties) {
				updateRanges(properties.start, properties.end);
		}

		// attach an event listener using the links events handler
		links.events.addListener(timeline, 'rangechange', onRangeChanged);
	
		function onChanged(){
			console.log(data[0].start.toLocaleString() + " " + data[0].end.toLocaleString());
			projectModel.StartMoment(data[0].start);
			projectModel.EndMoment(data[0].end);
			
		}

		function onAdded(){
			timeline.cancelAdd();
		}
		
		links.events.addListener(timeline, 'change', onChanged);
		links.events.addListener(timeline, 'add', onAdded);
				
		timelines.push(timeline);
		// Draw our timeline with the created data and options
		timeline.draw(data, options);
	}
}
	
/////,
	//update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
   //		console.log("Updating the project binding");
   //	}
// //
// //
// //
/////
ko.bindingHandlers.taskTimeLine = {
	init: function(element, accessor, allBindingsAccessor, viewModel, bindingContext){
		var taskModel = accessor();
		var data = [
			{
				'start': new Date(taskModel.StartMoment()),
				'end' : new Date(taskModel.EndMoment()),
				'content' : "taak <span data-taskid=" + taskModel.TaskId + "> </span> ",
				'type' : "range",
				'className' : 'ctm-box',
				'ctmItemType' : 'ctm-task'
			}
		];
		var parent = bindingContext.$parent;
		// specify options
		var options = {
			start : new Date(parent.StartMoment()),
			end : new Date(parent.EndMoment()),
			width:  timelinewidth,
			height: timelineheigth,
			editable: true,   // enable dragging and editing events
			style: "range",
			showMajorLabels : false,
			showMinorLabels : true,
			scale: parent.Scale,
			step: parent.Step
		};
		
		var timeline = new links.Timeline(element);
		
		function onRangeChanged(properties) {
			updateRanges(properties.start, properties.end);
			var $positionNow = $(element).find(".timeline-currenttime").position().left;
			$(element).next().css("left", $positionNow)
	
		}

		// attach an event listener using the links events handler
		links.events.addListener(timeline, 'rangechange', onRangeChanged);
		
		function onChanged(){
			console.log(data[0].start.toLocaleString() + " " + data[0].end.toLocaleString());
			taskModel.StartMoment(data[0].start);
			taskModel.EndMoment(data[0].end);
		}
			
			
		function onAdded(){
			timeline.cancelAdd();
		}
		
		links.events.addListener(timeline, 'change', onChanged);
		links.events.addListener(timeline, 'add', onAdded);
	
			
		timelines.push(timeline);
		// Draw our timeline with the created data and options
		timeline.draw(data, options);
		
		
		var $positionNow = $(element).find(".timeline-currenttime").position().left;
		$(element).next().css("left", $positionNow);
	}
}

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


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var getInitialData = function (Scale, Step){
	
	var result = new Array();
	
	var nrProjects = 10;
	var maxNrTasksPerProject = 6;
	var minNrTasksPerProject = 2;
	
	var maxNrOfDaysBeforeTodayOfProjectStart = 3;
	var maxNrOfDaysAfterTodayOfProjectEnd = 3;
	var dateRange = maxNrOfDaysBeforeTodayOfProjectStart + maxNrOfDaysAfterTodayOfProjectEnd;
	var msInADay = 86400000;
	var msInAnHour = 3600000;
	
	var minLengthOfTaskInHours = 1;
	var maxLengthOfTaskInHours = 8;
	
	var todayDate = new Date();
	
	var todayDay = todayDate.getDate();
	var todayMonth = todayDate.getMonth();
	var todayYear = 2013;
	var startOfTodayDate = new Date(2013, todayMonth, todayDay, 0, 0, 0 );
	var msNow = startOfTodayDate.getTime();
	var msMininmal = (msNow - maxNrOfDaysBeforeTodayOfProjectStart* msInADay);
	var minimalDateStart = new Date(msMininmal); 
	
	var minMsProject = msNow + (msInADay*dateRange);
	var maxmsProject = 0
	
	var taskIndex = 0;
	for(var p = 1; p < nrProjects +1; p++){

		var minMsProject = msNow + (msInADay*dateRange);
		var maxmsProject = 0
	
		var project = new Object();
		project.ProjectName = "Project " + p;
		project.Tasks = new Array();
		project.Scale = Scale;
		project.Step = Step;

		var nrTasksInProject = getRandomInt(minNrTasksPerProject,maxNrTasksPerProject);
		 	
		for(var t = 0; t <  nrTasksInProject; t++){
			var task = new Object();
			
			task.TaskId = taskIndex;
			task.TaskName = "Taak " + t;
			task.TeamName = "Team " + p;
			
			var taskMsStart = msMininmal + getRandomInt(0, dateRange)*msInADay;
			var taskMsEnd = taskMsStart + getRandomInt(minLengthOfTaskInHours, maxLengthOfTaskInHours)*msInAnHour;
			task.StartMoment = new Date(taskMsStart);
			task.EndMoment = new Date(taskMsEnd);
			
			project.Tasks.push(task);
			
			if(minMsProject > taskMsStart){
				minMsProject = taskMsStart;
			}
			
			if(maxmsProject <taskMsEnd){
				maxmsProject = taskMsEnd;
			}
			taskIndex++;
		} 

		project.StartMoment = new Date(minMsProject);
		project.EndMoment = new Date(maxmsProject);
		
		result.push(project);
		
	}

	return 	result;
}

var koTaskModel =function (task){

	var self = this;
	self.TaskId = task.TaskId;
	self.TaskName= task.TaskName;
	self.StartMoment= ko.observable(new Date(task.StartMoment)).extend({ date: true });
	self.EndMoment= ko.observable(new Date(task.EndMoment)).extend({ date: true });			
	self.TeamName= task.TeamName;
	self.AssignedTo=ko.observable(task.AssignedTo);		
	self.Completed = 80;

	
}

var koProjectModel = function(project){
	var self = this;
	
	self.ProjectName = project.ProjectName, 
	self.StartMoment = ko.observable(new Date(project.StartMoment)).extend({ date: true }),
	self.EndMoment = ko.observable(new Date(project.EndMoment)).extend({ date: true }),
	self.Tasks = ko.observableArray(
			ko.utils.arrayMap(project.Tasks, function(task){
				return new koTaskModel(task);
			}));
	self.Completed = 70;					
	self.Scale = ko.observable(project.Scale);
	self.Step = ko.observable(project.Step);
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
	};
	
	self.firstStartDate = ko.computed(function(){
		var startDate = new Date(self.projects()[0].StartMoment());
		
		for(var p =1; p < self.projects().length; p++){
			if(+startDate >= +self.projects()[p].StartMoment()){
				startDate = new Date(self.projects()[p].StartMoment());
			} 
		}
		
		return startDate;
	});
	
	self.lastEndDate = ko.computed(function(){
		var endDate = new Date(self.projects()[0].EndMoment());
		
		for(var p =1; p < self.projects().length; p++){
			if(+endDate <= +self.projects()[p].EndMoment()){
				endDate = new Date(self.projects()[p].EndMoment());
			} 
		}
		
		return endDate;
	});	
	
	self.SetScaling = function(Scale, Step){
		for(var p =1; p < self.projects().length; p++){
			self.projects()[p].Scale(Scale);
			self.projects()[p].Step(Step);
			console.log("Project NR " + p + " Scale = " + self.projects()[p].Scale() + " Step = " + self.projects()[p].Step());
		}
	};

    self.lastSavedJson = ko.observable("");
};