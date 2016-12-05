var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var moveListSchema = new Schema ({
    name: String
});

var Move = mongoose.model('Move', moveListSchema);

module.exports = Move;
