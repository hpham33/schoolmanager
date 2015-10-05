'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Transaction Schema
 */
var TransactionSchema = new Schema({
	amount: {
		type: Number,
		default: 0,
		required: 'Please fill transaction amount'
	},
	type: {
		type: String,
		enum: ['in', 'out'],
		required: 'Please fill transaction type',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now,
		index: true,
		required: 'Please fill transaction date'
	},
	student: {
		type: Schema.ObjectId,
		ref: 'Student',
		index: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Transaction', TransactionSchema);
