const {MongoClient, GridFSBucket} = require('mongodb');
const uri = 'mongodb+srv://admin:admin@antistress-player.tnwni.mongodb.net';
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var _db;
// var _bucket;

module.exports = {
    connectToServer: function(errorHandler) {
        client.connect((err, cli) => {
            if (cli) {
                _db = cli.db('music');
                // _bucket = new GridFSBucket(_db);
                console.log('Succesfully connected to MongoDB');
            }
            return errorHandler(err);
        });
    },

    getDb: function() {
        return _db;
    },

    // getBucket: function() {
    //     return _bucket;
    // }
}
