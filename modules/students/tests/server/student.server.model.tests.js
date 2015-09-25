'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Student = mongoose.model('Student');

/**
 * Globals
 */
var user, student;

/**
 * Unit tests
 */
describe('Student Model Unit Tests:', function () {
    beforeEach(function (done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'M3@n.jsI$Aw3$0m3'
        });

        user.save(function () {
            student = new Student({
                studentId: '123',
                name: 'Student Name',
                gender: 'male',
                address: 'Student Address',
                referrer: '1234567890',
                user: user
            });

            done();
        });
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            this.timeout(10000);
            return student.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without studentId', function (done) {
            student.studentId = '';

            return student.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function (done) {
        Student.remove().exec(function () {
            User.remove().exec(done);
        });
    });
});