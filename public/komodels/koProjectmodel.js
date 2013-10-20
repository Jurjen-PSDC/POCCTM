/**
 * KO Extender to display dates
 */
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



/**
 * Returns a random integer between to numbers
 * @param {int} minimum value
 * @param {int} maximum value
 * @return {int} random int
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Creates a test dataset.
 * @return {array of Objects} Set of projects
 */
var getInitialData = function (){
	
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


		
	/*
 	 *  Custom binding handler for binding a project timeline item to an element in the DOM. 
 	 *  This will create a CHAPS timeline item for a project line. The timeline item 
 	 *  is then saved in the Timeline property of the project. 
 	 */	
	ko.bindingHandlers.projectTimeLine = {
		init: function(element, accessor, allBindingsAccessor, viewModel, bindingContext){
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
				scale: links.Timeline.StepDate.SCALE.DAY,
				step: 1
			};
			
			// Create the timeline object
			var timeline = new links.Timeline(element);

			// Creating a function to handle the changes in the visble range (horizontal scrolling)
			function onRangeChanged(properties) {
				bindingContext.$root.updateRangesModel(properties.start, properties.end);
			}

			// Creating a function to update the model when the timeline item start or end date are changed.
			function onChanged(){
				projectModel.StartMoment(data[0].start);
				projectModel.EndMoment(data[0].end);
				
			}

			// Disabling the adding of a new item
			function onAdded(){
				timeline.cancelAdd();
			}
		
			// Attach event listeners using the links events handler
			links.events.addListener(timeline, 'rangechange', onRangeChanged);
			links.events.addListener(timeline, 'change', onChanged);
			links.events.addListener(timeline, 'add', onAdded);

			// Adding the timeline component to the project model
			projectModel.Timeline(timeline);
					
			// Draw our timeline with the created data and options
			timeline.draw(data, options);
		}
	}
	
	/*
 	 *  Custom binding handler for binding a task timeline item to an element in the DOM. 
 	 *  This will create a CHAPS timeline item for a task line. The timeline item 
 	 *  is then saved in the Timeline property of the task. 
 	 */
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
				scale: links.Timeline.StepDate.SCALE.HOUR,
				step: 12
			};
		
			// Create the timeline object
			var timeline = new links.Timeline(element);

			// Creating a function to handle the changes in the visble range (horizontal scrolling)
			function onRangeChanged(properties) {
				bindingContext.$root.updateRangesModel(properties.start, properties.end);
				var $positionNow = $(element).find(".timeline-currenttime").position().left;
				$(element).next().css("left", $positionNow)
		
			}

			// Creating a function to update the model when the timeline item start or end date are changed.
			function onChanged(){
				taskModel.StartMoment(data[0].start);
				taskModel.EndMoment(data[0].end);
			}
				
			// Disabling the adding of a new item
			function onAdded(){
				timeline.cancelAdd();
			}

			// Attach event listeners using the links events handler
			links.events.addListener(timeline, 'rangechange', onRangeChanged);
			links.events.addListener(timeline, 'change', onChanged);
			links.events.addListener(timeline, 'add', onAdded);
			
			// Add the timeline component to the Task model	
			taskModel.Timeline(timeline);
							
			// Draw our timeline with the created data and options
			timeline.draw(data, options);
			
			
			var $positionNow = $(element).find(".timeline-currenttime").position().left;
			$(element).next().css("left", $positionNow);
		}
	}	

/**
 *  KO Viewmodel for tasks
 * 	@param {JSON data} task to create to model of.
 *  
 */
var koTaskModel =function (task){

	var self = this;
	self.TaskId = task.TaskId;
	self.TaskName= task.TaskName;
	self.StartMoment= ko.observable(new Date(task.StartMoment)).extend({ date: true });
	self.EndMoment= ko.observable(new Date(task.EndMoment)).extend({ date: true });			
	self.TeamName= task.TeamName;
	self.AssignedTo=ko.observable(task.AssignedTo);		
	self.Completed = 80;
	self.Timeline = ko.observable("");
	
	/*
 	 *  Updating the Visible Chart ranges of the timeline item of the task
 	 */
	self.updateTimeLineRangesTask = function(start, end){
		self.Timeline().setVisibleChartRange(start, end);
	};


	/*
 	 *  Updating the Scales and the visible Chart ranges of the timeline 
 	 *  item of the task
 	 */
	self.setScalesTask  = function(scale, step, start, end){
		if(self.Timeline() != ""){
			var data = new Object();
			data.start = start;
			data.end = end;
		
			self.Timeline().updateData(0, data );
			self.Timeline().setScaleCTM(scale,step);
			self.Timeline().setVisibleChartRange(start, end,true);
		}
	};
}


/**
 *  KO Viewmodel for projects
 * 	@param {JSON data} projects to create to model of.
 *  
 */
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
	self.Timeline = ko.observable("");

	/*
 	 *  Updating the Visible Chart ranges of the timeline item of the project
 	 *  and its tasks.
 	 */
	self.updateTimeLineRangesProject = function(start, end){
		self.Timeline().setVisibleChartRange(start, end);
		for(var t =0; t < self.Tasks().length; t++){
			self.Tasks()[t].updateTimeLineRangesTask(start, end);
		}
	};

	/*
 	 *  Updating the Scales and the visible Chart ranges of the timeline 
 	 *  item of the project and its tasks.
 	 */
	self.setScalesProject = function(scale, step, start, end){
		if(self.Timeline() !==  ""){
			var data = new Object();
			data.start = start;
			data.end = end;
			self.Timeline().updateData(0, data );
			self.Timeline().setScaleCTM(scale,step);
			self.Timeline().setVisibleChartRange(start, end, true);
			//self.Timeline().render();
		}	
		for(var t =0; t < self.Tasks().length; t++){
			self.Tasks()[t].setScalesTask(scale, step, start, end);
		}
	};

}


/**
 * Main KO Viewmodel
 * 	@param {JSON data} projects to create to model of.
 * 
 */
var koProjectsModel = function(projects) {
    var self = this;
	
	/*
	 *  An observable array containing all projects.  	
	 */
	self.projects = ko.observableArray(
						ko.utils.arrayMap(projects, function(project) {
							return new koProjectModel(project);
						}));

	/*
	 * Functions of the Model. 	
	 */

	/*
	 *  Saves the current model in the property lastSavedJson. 	
	 */
	self.save = function() {
        self.lastSavedJson(
		JSON.stringify(ko.toJS(self.projects), null, 2));
	};


	/*
	 * Calculates the first existing starttime of all tasks. 	
	 */	
	self.firstStartDate = ko.computed(function(){
		var startDate = new Date(self.projects()[0].StartMoment());
		
		for(var p =1; p < self.projects().length; p++){
			if(+startDate >= +self.projects()[p].StartMoment()){
				startDate = new Date(self.projects()[p].StartMoment());
			} 
		}
		
		return startDate;
	});
	

	/*
	 * Calculates the last existing endtime of all tasks. 	
	 */
	self.lastEndDate = ko.computed(function(){
		var endDate = new Date(self.projects()[0].EndMoment());
		
		for(var p =1; p < self.projects().length; p++){
			if(+endDate <= +self.projects()[p].EndMoment()){
				endDate = new Date(self.projects()[p].EndMoment());
			} 
		}
		
		return endDate;
	});	
	
	/*
	 * Function to update the ranges of the timeline components	
	 */
	self.updateRangesModel = function(start, end){
		for(var p =0; p < self.projects().length; p++){
			self.projects()[p].updateTimeLineRangesProject(start, end);
		}
	};

	/*
	*  Switching scales in the timeline to display 36 hours from the start 
	*  of the first task in the current view.
	*/
	self.switchViewScalesDay  = function(data, event){
	
		var scale = links.Timeline.StepDate.SCALE.HOUR;
		var step = 12;
		var start = self.firstStartDate();
		var end = new Date(start.getTime() + 1 * 36*3600*1000);;
		
		for(var p =0; p < self.projects().length; p++){
			self.projects()[p].setScalesProject(scale, step, start, end);
		}

	};

	/*
	*  Switching scales in the timeline to display 7 days from the start 
	*  of the first task in the current view.
	*/
	self.switchViewScalesWeek  = function(data, event){
	
		var scale = links.Timeline.StepDate.SCALE.WEEKDAY;
		var step = 1;
		var start = self.firstStartDate();
		var end = new Date(start.getTime() + 7 * 24*3600*1000);;
		
		for(var p =0; p < self.projects().length; p++){
			self.projects()[p].setScalesProject(scale, step, start, end);
		}

	};

	/*
	*  Switching scales in the timeline to display 28 days from the start 
	*  of the first task in the current view.
	*/
	self.switchViewScalesMonth  = function(data, event){
	
		var scale = links.Timeline.StepDate.SCALE.WEEKDAY;
		var step = 7;
		var start = self.firstStartDate();
		var end = new Date(start.getTime() + 28 * 24*3600*1000);;
		
		for(var p =0; p < self.projects().length; p++){
			self.projects()[p].setScalesProject(scale, step, start, end);
		}

	};

	self.lastSavedJson = ko.observable("");
};