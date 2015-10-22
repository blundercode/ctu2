var Question = require('../server/home/QuestionModel.js');
var QuestionController = require('./QuestionController.js');

module.exports = {
	read: function(req, res) {
		console.log(req.body);
		Question.find(req.query)
		.exec(function(err, result) {
			if(err) return res.status(500).send(err);
			else res.send(result);
		});
	},

	// readPertz: function(req, res){
	// 	Question.find(req.query)
	// 	.populate('pertz')
	// 	.exec(function(err, result) {
	// 		if(err) return res.status(500).send(err);
	// 		else res.send(result);
	// 	});
	// },

	create: function(req, res) {
		console.log("body:", req.body);

		var newQuestion = new Question(req.body);
		newQuestion.save(function(err, result) {
			if(err) return res.status(500).send(err);

			// Save image to amazon
			// MainController.saveImage(req, res, result);

			// when success send:
			// return res.send(result);
		});
	},

	update: function(req, res) {
		User.findByIdAndUpdate(req.params.id, req.body, function(err, result) {
			if(err) return res.status(500).send(err);
			else res.send(result);
		});
	},

	// updatePertz: function(req, res) {
	// 	User.findByIdAndUpdate(req.params.id, req.body, function(err, result) {
	// 		if(err) return res.status(500).send(err);
	// 		else {
	// 			User.find(req.params.id)
	// 			.populate('pertz')
	// 			.exec(function(err, result){
	// 				if(err) return res.status(500).send(err);
	// 				else res.send(result);
	// 			});
	// 		};
	// 	});
	// },

	delete: function(req, res) {
		User.findByIdAndRemove(req.params.id, function(err, result) {
			if(err) return res.status(500).send(err);
			else res.send(result);
		});
	},

	search: function(req, res) {
		var re = new RegExp(req.params.search, 'i');
    	User.find().or([{ 'skills': { $regex: re }}, 
    					{ 'firstName': { $regex: re }},
    					{ 'lastName': { $regex: re }},
    					{ 'tagline': { $regex: re }},
    					{ 'userName': { $regex: re }}
    					]).exec(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
    })

	}

};