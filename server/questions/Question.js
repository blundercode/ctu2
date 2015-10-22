var odm = require('mongoose');

var QuestionSchema = new odm.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    postedBy: { type: String, required: false },
    createdOn: { type: Date, default: Date.now }
});

// the third argument is the collection name
module.exports = odm.model('Question', QuestionSchema, 'questions');