'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Student Schema
 */
var StudentSchema = new Schema({
	studentId: {
		type: String,
		default: '',
		required: 'Please fill Student id',
		trim: true
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Student name',
		trim: true
	},
	class: {
		type: String,
		trim: true
	},
	birthday: {
		type: Date
	},
	gender: {
		type: String,
		enum: ['male', 'female']
	},
	address: {
		type: String,
		trim: true
	},
	referrer: {
		type: String,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Student', StudentSchema);
