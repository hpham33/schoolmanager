'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a student
 */
exports.create = function (req, res) {
  var student = new Student(req.body);
  student.user = req.user;

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

  student.title = req.body.title;
  student.content = req.body.content;

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

  student.remove(function (err) {
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
 * List of Students
 */
exports.list = function (req, res) {
  Student.find().sort('-created').populate('user', 'displayName').exec(function (err, students) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(students);
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
