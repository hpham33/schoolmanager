'use strict';

/**
 * Module dependencies.
 */
var statisticsPolicy = require('../policies/statistics.server.policy'),
  statistics = require('../controllers/statistics.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/statistics')
    .get(statistics.list);
};
