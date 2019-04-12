'use strict';

const pipe = require('./pipe');
const context = require('./context');

// Need more promise power
global.Promise = require('bluebird');

class Tester {
    constructor() {
		this._middleware = [];
		// The test name
		this._name = '';
		// Tests to run before all
		this._beforeAll = done => done();

        this._errors = [];
        this._ctx = context;
        this._results = [];

        this.handleError = this.handleError.bind(this);
        this.onStart = this.onStart.bind(this);
        this.start = this.start.bind(this);
    }

    handleError(e) {
        console.log('app error:', e);
        this._errors.push({
            message: e.message
        });
    }

    /**
     * Push middleware to the stack
     * @param {Function} middleware middleware function
     */
    use(middleware) {
        this._middleware = [...this._middleware, middleware];
    }

    /**
     * All middleware to be run
     * @param {*} middleware middleware arguments
     */
    all(middleware) {
        this._middleware = [...this._middleware, ...middleware];
    }

    onStart(func) {
        console.log('started tests', func);
	}

	makeTest() {
		return (promise, i) => {

			it(this._middleware[i].name || '----', done => {
				promise.then(res => done(null, res));
			}).timeout(0);
		}
	}

	/**
	 * Promisify the tests
	 * @param {Array} tests
	 */
	wrapTests(tests) {
		const out = [];

		tests.map(testItem => {
			if (!testItem.test) {
				throw new Error('Middleware must include a test!');
			}

			return new Promise((resolve, reject) => {
				out.push({resolve, reject});
			});
		}).forEach(this.makeTest());

		return out;
	}

    /**
     * Run the middleware
     */
    start() {
		const pipeLine = pipe(this._middleware);
		const promiseChain = this.wrapTests(this._middleware);
		// // If there are no tests
		if (pipeLine.length === 0) {
			throw new Error('No tests defined');
		}

		let tests;

		describe(this._name, () => {
			// Run the before tests
			before(this._beforeAll)

			// Start the tests
			tests = pipeLine(this._ctx, promiseChain)
		})

        return tests;
    }

    /**
     * Sets the context settings
     * @param {*} settings context settings
     */
    setContext(settings) {
       this._ctx = {
           ...this._ctx,
           ...settings
       }
    }

    setArgument(argument){
        this.setContext({
            arguments: {
                ...this._ctx.arguments,
                ...argument
            }
        })
	}

	set(key, value) {
		return this[`_${key}`] = value;
	}
}

module.exports = Tester;