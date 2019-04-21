/**
 * Compose together the tests to behave like tests
 * @param {Array} tests the tests array to loop over
 */

module.exports = (tests) => {
    for (const f of tests) {
        if (typeof f !== 'object') {
            throw new Error('Tests must be an Object!');
        }
	}

	const runTest = (step, ctx) => {
		return Promise.try(() => {
			return Promise.try(() => {
				return step.before ? Promise.try(() => step.before(ctx)) : ctx;
			}).then(ctx => {
				return Promise.try(() => step.test(ctx));
			}).then(ctx => {
				return step.after ? Promise.try(() => step.after(ctx)) : ctx;
			});
		});
	};

    return async (ctx, promiseChain) => {

		return Promise.reduce(tests, (ctx, step, i) => {
			const p = promiseChain[i];

			return Promise.try(() => {
				// Run the test
				return runTest(step, ctx);
			}).then(ctx => {
				// Complete the test
				p.resolve(ctx);
				// Set the new ctx
				return ctx;
			}).catch(err => {
				p.reject(err);
				i++;
				if (step.exitOnFail) {
					while (i < p.length) {
						p.resolve(new Error('Previous test failed'));
						i++;
					}
					return Promise.reject(err);
				}

				return ctx;
			});
		}, ctx);
    }
}