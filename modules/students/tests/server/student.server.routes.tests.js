'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Student = mongoose.model('Student'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, student;

/**
 * Student routes tests
 */
describe('Student CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new student
    user.save(function () {
      student = {
        title: 'Student Title',
        content: 'Student Content'
      };

      done();
    });
  });

  it('should be able to save an student if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new student
        agent.post('/api/students')
          .send(student)
          .expect(200)
          .end(function (studentSaveErr, studentSaveRes) {
            // Handle student save error
            if (studentSaveErr) {
              return done(studentSaveErr);
            }

            // Get a list of students
            agent.get('/api/students')
              .end(function (studentsGetErr, studentsGetRes) {
                // Handle student save error
                if (studentsGetErr) {
                  return done(studentsGetErr);
                }

                // Get students list
                var students = studentsGetRes.body;

                // Set assertions
                (students[0].user._id).should.equal(userId);
                (students[0].title).should.match('Student Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an student if not logged in', function (done) {
    agent.post('/api/students')
      .send(student)
      .expect(403)
      .end(function (studentSaveErr, studentSaveRes) {
        // Call the assertion callback
        done(studentSaveErr);
      });
  });

  it('should not be able to save an student if no title is provided', function (done) {
    // Invalidate title field
    student.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new student
        agent.post('/api/students')
          .send(student)
          .expect(400)
          .end(function (studentSaveErr, studentSaveRes) {
            // Set message assertion
            (studentSaveRes.body.message).should.match('Title cannot be blank');

            // Handle student save error
            done(studentSaveErr);
          });
      });
  });

  it('should be able to update an student if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new student
        agent.post('/api/students')
          .send(student)
          .expect(200)
          .end(function (studentSaveErr, studentSaveRes) {
            // Handle student save error
            if (studentSaveErr) {
              return done(studentSaveErr);
            }

            // Update student title
            student.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing student
            agent.put('/api/students/' + studentSaveRes.body._id)
              .send(student)
              .expect(200)
              .end(function (studentUpdateErr, studentUpdateRes) {
                // Handle student update error
                if (studentUpdateErr) {
                  return done(studentUpdateErr);
                }

                // Set assertions
                (studentUpdateRes.body._id).should.equal(studentSaveRes.body._id);
                (studentUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of students if not signed in', function (done) {
    // Create new student model instance
    var studentObj = new Student(student);

    // Save the student
    studentObj.save(function () {
      // Request students
      request(app).get('/api/students')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single student if not signed in', function (done) {
    // Create new student model instance
    var studentObj = new Student(student);

    // Save the student
    studentObj.save(function () {
      request(app).get('/api/students/' + studentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', student.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single student with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/students/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Student is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single student which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent student
    request(app).get('/api/students/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No student with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an student if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new student
        agent.post('/api/students')
          .send(student)
          .expect(200)
          .end(function (studentSaveErr, studentSaveRes) {
            // Handle student save error
            if (studentSaveErr) {
              return done(studentSaveErr);
            }

            // Delete an existing student
            agent.delete('/api/students/' + studentSaveRes.body._id)
              .send(student)
              .expect(200)
              .end(function (studentDeleteErr, studentDeleteRes) {
                // Handle student error error
                if (studentDeleteErr) {
                  return done(studentDeleteErr);
                }

                // Set assertions
                (studentDeleteRes.body._id).should.equal(studentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an student if not signed in', function (done) {
    // Set student user
    student.user = user;

    // Create new student model instance
    var studentObj = new Student(student);

    // Save the student
    studentObj.save(function () {
      // Try deleting student
      request(app).delete('/api/students/' + studentObj._id)
        .expect(403)
        .end(function (studentDeleteErr, studentDeleteRes) {
          // Set message assertion
          (studentDeleteRes.body.message).should.match('User is not authorized');

          // Handle student error error
          done(studentDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Student.remove().exec(done);
    });
  });
});
