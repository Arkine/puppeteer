/**
 * Compose together the tests to behave like middleware
 * @param {Array} middleware the middleware array to loop over
 */

module.exports = (middleware) => {
    for (const f of middleware) {
        if (typeof f !== 'object') {
            throw new Error('Middleware must be an Object!');
        }
	}

	const executeStep = (step, res) => {
		return Promise.try(() => {
			return Promise.try(() => step.test(res));
		});
	};

    return async (ctx, promiseChain) => {
		return Promise.reduce(middleware, (res, step, i) => {
			const test = promiseChain[i];

			return Promise.try(() => {
				return executeStep(step, res);
			}).then(res => {
				test.resolve(res);
				return res;
			}).catch(err => {
				test.reject(err);
				i++
				while (i < middleware.length) {
					test.resolve(new Error('Previous test failed'));
					i++;
				}
				return Promise.reject(err);
			});
		}, ctx);

		// /**
		//  * Promisify each test for iterating
		//  */
		// const wrapMiddleware() {
		// 	return middleware.map(test => {
		// 		if (!test.it) {
		// 			throw new Error('The test must include an it function');
		// 		}

		// 		new Promise((resolve, reject) => {
		// 			return ({resolve, reject});
		// 		})
		// 	}).map(test(ctx))
		// }

        // const applyFunc = (i) => {
        //     let fn = middleware[i];
        //     if (i === middleware.length) {
        //         fn = next;
        //     }

        //     // If we are at the last function, resolve
        //     if (!fn) {
        //         return Promise.resolve();
        //     }

        //     // Iterate through the middleware chain
        //     try {
        //         return Promise.resolve(fn(ctx, applyFunc.bind(null, (i + 1))));
        //     } catch (error) {
        //         return Promise.reject(error);
        //     }
        // }
        // // Initiate the function callcc
        // return applyFunc(0)
    }
}