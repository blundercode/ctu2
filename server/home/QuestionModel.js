var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({

	title: { type: String, require: true },
	description: { type: String, require: true },
	name: { type: String, require: true}, 
	ctu: {
		type: [{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Question'
       }]
   }

});

module.exports = mongoose.model('Question', questionSchema);
