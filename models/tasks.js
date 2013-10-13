var azure = require('azure'), uuid = require('node-uuid')
 
module.exports = Tasks;


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

function createMockTask(index, partitionKey){
	
	var taskNames =  ["Plan van aanpak","Mening ouder/jongere verwerkt",
						"Evaluatie rapportage", "Risico Taxatie", 
						"Intake gesprek slachtoffer", "Overleg behandelaars", 
						"Verwerken formulier", "Zaak analyse gedragwetenschapper"];
	var taskNameId = Math.floor((Math.random()*taskNames.length));
	var taskName = taskNames[taskNameId];
	
	var teamNames =  ["Team1","Team2","Administratie", "Buitendienst"];
	var teamNameId = Math.floor(Math.random()*teamNames.length);
	var teamName = teamNames[teamNameId];	
	
	var projectNames =  ["ProjectA","ProjectB","ProjectC"];
	var projectNameId = Math.floor(Math.random()*projectNames.length);
	var projectName = projectNames[projectNameId];	
	
	var teamMembers =  ["Jurjen","Michel","Luc", "Hans"];
	var teamMemberId = Math.floor(Math.random()*teamMembers.length);
	var teamMember = teamMembers[teamMemberId];	
	
	var completed = Math.floor(Math.random()*100)+1;
	
	var startedDay = Math.floor(Math.random()*10)+1;
	var startedDate = new Date(2013,8,startedDay,09,00,0);
 	
	var minutesToAddList = [15, 30, 45];
	var minutesToAdd = minutesToAddList[Math.floor(Math.random()*3)];
	var hoursToAdd = Math.floor(Math.random()*3);
	var completionDate = new Date(2013,8,startedDay,09,00,0).addHours(hoursToAdd);
 	completionDate = completionDate.addMinutes(minutesToAdd);

	var item = {
		RowKey : uuid(),
        PartitionKey : partitionKey,
		Priority: index,
		Name : taskName,
		TeamName : teamName,
		ProjectName : projectName,
		AssignedTo : teamMember,
		PercCompleted : completed,
		StartDate: startedDate,
		CompletionDate : completionDate
	}
	
	console.log("Created task " + item.RowKey);
	console.log(" PK " + item.PartitionKey);
	console.log(" Prio " + item.Priority);
	console.log(" Name " + item.Name);
	console.log(" TeamName " + item.TeamName);
	console.log(" ProjectName " + item.ProjectName);
	console.log(" AssignedTo " + item.AssignedTo);
	console.log(" PercCompleted " + item.PercCompleted);
	console.log(" StartDate " + item.StartDate);
	console.log(" hoursToAdd / minutesToAdd " + hoursToAdd + " " + minutesToAdd);
	console.log(" CompletionDate " + item.CompletionDate);
			
	return item;
} 
 
function Tasks(storageClient, tableName, partitionKey) {
    this.storageClient = storageClient;
    this.tableName = tableName;
    this.partitionKey = partitionKey;
 
    this.storageClient.createTableIfNotExists(tableName,
        function tableCreated(err){
			if(err) {
                throw error;
            }
        });
};
 
Tasks.prototype = {
    find: function(query, callback) {
        self = this;
        self.storageClient.queryEntities(query,
            function entitiesQueried(err, entities) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, entities);
                }
            });
    },
    addItem: function(item, callback) {
        self = this;
        item.RowKey = uuid();
        item.PartitionKey = self.partitionKey;
        self.storageClient.insertEntity(self.tableName, item,
            function entityInserted(error) {
                if(error) {
                    callback(error);
                } else {
                    callback(null);
                }
            });
	},
	deleteItem: function(item, callback){
		self = this;
		self.storageClient.deleteEntity(
			self.tableName,
			{ 
				PartitionKey : item.PartitionKey,
				RowKey : item.RowKey
			},
			function(error){
					if(error){
						callback(error);
						}
						else{
						 callback(null);
						}
					}
		);
	},
	addMockTasks: function(){
		self = this;
		
		for(i =0; i <100; i++){
			var task = createMockTask(i, self.partitionKey);
			self.storageClient.insertEntity(self.tableName, task,
             function entityInserted(error) {
                 if(error) {
                     callback(error);
                 }
                  
			});
		}
	}	
}