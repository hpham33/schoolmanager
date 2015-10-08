'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Transaction = mongoose.model('Transaction'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	_ = require('lodash');

/**
 * Create a transaction
 */
exports.create = function (req, res) {
	var transactions;
	if (_.isArray(req.body)) {
		transactions = _.map(req.body, function (item) {
			item.user = req.user;
			return item;
		});
	} else {
		transactions = req.body;
		transactions.user = req.user;
	}

	Transaction.create(transactions, function (err, results) {
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
 * Show the current transaction
 */
exports.read = function (req, res) {
	res.json(req.transaction);
};

/**
 * Update a transaction
 */
exports.update = function (req, res) {
	var transaction = req.transaction;

	transaction = _.extend(transaction, req.body, true);

	transaction.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(transaction);
		}
	});
};

/**
 * Delete an transaction
 */
exports.delete = function (req, res) {
	var transaction = req.transaction;

	transaction.remove(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(transaction);
		}
	});
};

/**
 * List of Transactions
 */
exports.list = function (req, res) {
	var query = Transaction.find({
		student: req.query.student,
		created: {$gte: req.query.dateFrom, $lte: req.query.dateTo}
	});

	if (req.query) {
		if (req.query.skip) {
			query.skip(req.query.skip);
		}

		if (req.query.limit) {
			query.limit(req.query.limit);
		}

		if (req.query.orderBy) {
			query.sort(req.query.orderBy);
		} else {
			query.sort('created');
		}
	}

	query.populate('user', 'displayName').exec(function (err, transactions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transactions);
		}
	});
};

/**
 * Transaction middleware
 */
exports.transactionByID = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Transaction is invalid'
		});
	}

	Transaction.findById(id).populate('user', 'displayName').exec(function (err, transaction) {
		if (err) {
			return next(err);
		} else if (!transaction) {
			return res.status(404).send({
				message: 'No transaction with that identifier has been found'
			});
		}
		req.transaction = transaction;
		next();
	});
};

exports.totalAmount = function (req, res) {
	Transaction.aggregate([
		{
			$match: {
				student: mongoose.Types.ObjectId(req.query.student),
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
			res.jsonp(result[0]);
		}
	});
};
