'use strict';

(function () {
	// Common Service Spec
	describe('Common Service Tests', function () {
		// Initialize global variables
		var hpUtils;

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function (_hpUtils_) {
			// Point global variables to injected services
			hpUtils = _hpUtils_;
		}));

		it('firstDayOfCurrentMonth - should return first day of this month', function () {
			var now = new Date();
			now.setDate(1);
			now.setHours(0);
			now.setMinutes(0);
			now.setSeconds(0);
			now.setMilliseconds(0);

			var day = hpUtils.firstDayOfCurrentMonth();

			expect(now.toISOString()).toEqual(day.toISOString());
		});

	});
}());
