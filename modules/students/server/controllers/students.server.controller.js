'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Student = mongoose.model('Student'),
	Transaction = mongoose.model('Transaction'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a student
 */
exports.create = function (req, res) {
    var students;
    if (_.isArray(req.body)) {
        students = _.map(req.body, function (item) {
            item.user = req.user;
            return item;
        });
    } else {
        students = req.body;
        students.user = req.user;
    }

    Student.create(students, function (err, results) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (_.isArray(results)) {
                res.json([{totalCreated: results.length}]);
            } else {
                res.json(results);
            }

        }
    });
};

/**
 * Show the current student
 */
exports.read = function (req, res) {
    res.json(req.student);
};

/**
 * Update a student
 */
exports.update = function (req, res) {
    var student = req.student;

    student = _.extend(student, req.body, true);

    student.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(student);
        }
    });
};

/**
 * Delete an student
 */
exports.delete = function (req, res) {
    var student = req.student;

	// first delete transactions belongs to this student
	Transaction.remove({ student: req.student }, function(err, response) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			student.remove(function (err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.json(student);
				}
			});
		}
	});
};

/**
 * List of Students
 */
exports.list = function (req, res) {
    var query = Student.find();

    if (req.query) {
        var skip = req.query.skip || 0;
        var limit = req.query.limit || 10;
        query.skip(skip).limit(limit);

        if (req.query.filterString) {
            query.or([{'name': {'$regex': req.query.filterString, '$options': 'i'}},
                {'studentId': {'$regex': req.query.filterString, '$options': 'i'}}]);
        }

        if (req.query.orderBy) {
            query.sort(req.query.orderBy);
        } else {
            query.sort('-created');
        }
    }

    query.populate('user', 'displayName').exec(function (err, students) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(students);
        }
    });
};

/**
 * Student middleware
 */
exports.studentByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Student is invalid'
        });
    }

    Student.findById(id).populate('user', 'displayName').exec(function (err, student) {
        if (err) {
            return next(err);
        } else if (!student) {
            return res.status(404).send({
                message: 'No student with that identifier has been found'
            });
        }
        req.student = student;
        next();
    });
};
