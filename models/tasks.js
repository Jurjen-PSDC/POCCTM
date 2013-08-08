var azure = require('azure'), uuid = require('node-uuid')
 
module.exports = Tasks;
 
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
    }
}