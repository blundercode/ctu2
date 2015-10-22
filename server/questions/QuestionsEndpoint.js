var Question = require('./Question.js');

module.exports = function (server, express) {
    var router = express.Router();

    // var QuestionSchema = new odm.Schema({
    //     title: { type: String, required: true },
    //     description: { type: String, unique: true },
    //     postedBy: { type: odm.Schema.Types.ObjectId, ref: 'User', required: false },
    //     createdOn: { type: Date, default: Date.now }
    // });

    router.route('/')
        .post(function (req, res) {
            console.log('LOG: Posting a question');

            // two ways of doing this the first:
            var newQuestion = new Question(req.body.question);

            newQuestion.save(function (err, question) {
                if (!!err) {
                    if (err.code === 11000) {
                        console.log('ERROR: Question already exists.');
                        return res.status(400).json({ success: false, message: 'Question already exists.' });
                    }

                    Object.keys(err.errors).forEach(function (key) {
                        var message = err.errors[key].message;
                        console.log('ERROR: Validation error for "%s": %s', key, message);
                    });

                    return res.status(400).json({ success: false, message: 'Could not save the question.' });
                } else {
                    res.status(201).json({
                        sucess: true,
                        data: question
                    });
                }
            });
            // this is the neater, but less flexible way
            // Question.create(req.body.question, function (err, question, next) { });
        })
        .get(function (req, res) {

            // ** query builder example **
            // var query = Question.find({ title: 'javascript' });
            // query.where('').gt(15);
            // query.sort('-lastLogin');
            // query.select('_id name email');
            // query.exec(function (err, students) { if (!err) { console.log(student)}});
            // can be chained like linq

            Question.find().exec(function (err, questions) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Could not get the questions.' });
                }

                res.status(200).json(questions);
            });

        });

    router.route('/:id')
        .get(function (req, res) {
            Question.findById(req.params.id).exec(function (err, question) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Could not get the question.' });
                }

                if (!!question) {
                    res.status(200).json({ success: true, data: question });
                } else {
                    return res.status(404).json({ success: false, message: 'The question was not found.' });
                }
            });
        })
        .put(function (req, res) {
            // using update(), findOneAndUpdate() or findByIdAndUpdate methods
            // do not apply default values, validation, middleware or setter specified in the schema
            // use a combination of find, edit and save instead to apply those
            Question.findById(req.params.id, function (err, question) {
                if (err) {
                    console.log('ERROR: Did not find question.');
                    return res.status(404).json({ success: false, message: 'question not found.' });
                }

                var modifiedQuestion = req.body.question;

                if (modifiedQuestion) {
                    console.log('updating: ' + question.title);
                    question.title = modifiedQuestion.title;
                    question.description = modifiedQuestion.description;

                    question.save(function (err, question) {
                        if (err) return res.status(500).json({ success: false, message: 'Could not update the question.' });

                        res.status(200).json({ success: true, data: question });
                    });
                }
            });
        })
        .delete(function (req, res) {
            Question.findByIdAndRemove(req.params.id, function (err, question) {
                if (err) return res.status(500).json({ success: false, message: 'Could not delete the question.' });

                console.log('LOG: Deleted ' + question.name);
                res.status(200).json(question);
            });
        });

    return router;
};