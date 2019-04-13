'use strict';

const pipe = require('./pipe');
const context = require('./context');

// Need more promise power
global.Promise = require('bluebird');

class Tester {
    constructor(options) {
		this._tests = options.tests || [];
		// The test name
		this._name = options.name || '';
		// Tests to run before all
		this._beforeAll = done => done();

        this._errors = [];
        this._ctx = context;
        this._results;

        this.handleError = this.handleError.bind(this);
        this.onStart = this.onStart.bind(this);
        this.start = this.start.bind(this);
    }

    handleError(e) {
        this._errors.push({
            message: e.message
        });
    }

    /**
     * Push middleware to the stack
     * @param {Function} test test function
     */
    use(test) {
        this._tests = [...this._tests, test];
    }

    /**
     * All tests to be run
     * @param {*} tests tests to be ran
     */
    addTests(tests) {
        this._tests = [...this._tests, ...tests];
    }

    onStart(func) {
        console.log('started tests', func);
	}

    /**
     * When the promise resolves, resolve it inside an it block and
     * done it
     */
	makeTest() {
		return (promise, i) => {
			it(this._tests[i].name || '----', done => {
				promise.then(ctx => done(null, ctx));
			});
		}
	}

	/**
	 * Promisify the tests
	 * @param {Array} tests
	 */
	promisifyTests(tests) {
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
		const pipeLine = pipe(this._tests);

		// // If there are no tests
		if (pipeLine.length === 0) {
			throw new Error('No tests defined');
		}

		describe(this._name, () => {
			// Run the before tests. If no before, return done
			before(this._beforeAll)

			// Start the tests
			pipeLine(this._ctx, this.promisifyTests(this._tests))
		});

        return this;
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