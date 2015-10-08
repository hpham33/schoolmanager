'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Transaction = mongoose.model('Transaction'),
	Student = mongoose.model('Student'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	_ = require('lodash');

exports.totalAmount = function (req, res) {
	Transaction.aggregate([
		{
			$match: {
				created: {$gte: new Date(req.query.dateFrom), $lte: new Date(req.query.dateTo)}
			}
		},
		{
			$project: {
				amountIn: {
					$cond: [{$eq: ['$type', 'in']}, '$amount', 0]
				},
				amountOut: {
					$cond: [{$eq: ['$type', 'out']}, '$amount', 0]
				}
			}
		},
		{
			$group: {
				_id: null,
				totalAmountIn: {$sum: '$amountIn'},
				totalAmountOut: {$sum: '$amountOut'}
			}
		},
		{
			$project: {
				totalAmountIn: 1,
				totalAmountOut: 1,
				balance: {$subtract: ['$totalAmountIn', '$totalAmountOut']}
			}
		}
	], function (err, result) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(result[0]);
		}
	});
};

/**
 * List of Statistics
 */
exports.list = function (req, res) {
	Transaction.aggregate([
		{
			$match: {
				created: {$gte: new Date(req.query.dateFrom), $lte: new Date(req.query.dateTo)}
			}
		},
		{
			$project: {
				student: 1,
				amountIn: {
					$cond: [{$eq: ['$type', 'in']}, '$amount', 0]
				},
				amountOut: {
					$cond: [{$eq: ['$type', 'out']}, '$amount', 0]
				}
			}
		},
		{
			$group: {
				_id: '$student',
				totalAmountIn: {$sum: '$amountIn'},
				totalAmountOut: {$sum: '$amountOut'}
			}
		},
		{
			$project: {
				totalAmountIn: 1,
				totalAmountOut: 1,
				balance: {$subtract: ['$totalAmountIn', '$totalAmountOut']}
			}
		}
	], function (err, result) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Student.populate(result, {path: '_id', model: 'Student', select: 'name'}, function (err, response) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(response);
				}
			});
		}
	});
};
