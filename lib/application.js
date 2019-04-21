'use strict';

const pipe = require('./pipe');
const context = require('./context');
const chalk = require('chalk');

// Need more promise power
global.Promise = require('bluebird');

class Tester {
    constructor(options) {
		this._tests = options.tests || [];
		// The test name
		this._name = options.name || '-------';
        // The testing context object
        this._ctx = context; 
		// Tests to run before all
        this._beforeAll = done => done();
        // Tests to run after all
        this._afterAll = done => done();
        // Passing tests
        this._passed = 0;
        // Failing tests
        this._failed = 0;

        this._startTime;
        this._endTime;

        this.handleError = this.handleError.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onFail = this.onFail.bind(this);
        this.onPass = this.onPass.bind(this);
        this.start = this.start.bind(this);
    }

    /**
     * On error
     * @param {Object} e 
     */
    handleError(e) {
        this._errors.push({
            message: e.message
        });
    }

    /**
     * Before tests
     * @param {Function} test fn to run before all of the tests
     */
    before(test) {
        this._beforeAll = test;
    }

    /**
     * 
     * @param {Function} test fn to run after all of the tests
     */
    after(test) {
        this._afterAll = test;
    }

    onPass() {
        this._passed += 1;
    }

    onFail(err) {
        this._failed += 1;
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

    /**
     * On tests start
     */
    onStart() {
        this._startTime = process.hrtime();
        // Came after the test title making it look ugly
        // this.displayBanner();
    }

    onEnd() {
        this._endTime = process.hrtime(this._startTime);
        this.displayMetrics();
    }

    displayMetrics() {
        console.log('\n******************');
        console.log('Tests Completed...');
        console.log(`${chalk.blue('Execution Time:')} ${this._endTime[0]}s`);
        console.log(`${chalk.green('PASSED:')} ${this._passed}/${this._tests.length}`);
        console.log(`${chalk.red('FAILED:')} ${this._failed}/${this._tests.length}`);
        console.log('******************\n');
    }
    
    // displayBanner() {
    //     console.log(chalk.white.bgGreen('/******* \n* Puppeteer Testing Framework!\n' + '* Developed by: Kevan Slyngstad (slyngstad55@gmail.com)\n' + '* /\n'));
    // }

    /**
     * When the promise resolves, resolve it inside an it block and
     * done it
     */
	makeTest() {
		return (promise, i) => {
			it(this._tests[i].name || '----', done => {
				promise.then(ctx => {
                    this.onPass();

                    return done(null, ctx)
                }).catch(e => {
                    this.onFail(e);
                    return done(e);
                });
			}).timeout(this._tests[i].timeout || 0);
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
			before((done) => {
                this.onStart();
                this._beforeAll(done);
            });

			// Start the tests
            pipeLine(this._ctx, this.promisifyTests(this._tests));
            
            // After all the tests
            after((done) => {
                this._afterAll(done);
                this.onEnd();
            });
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

    /**
     * Set the pupeteer arguments (not in use)
     * @param {Object} argument 
     */
    setArgument(argument){
        this.setContext({
            arguments: {
                ...this._ctx.arguments,
                ...argument
            }
        })
	}

    /**
     * Set class properties
     * @param {string} key 
     * @param {*} value 
     */
	set(key, value) {
		return this[`_${key}`] = value;
	}
}

module.exports = Tester;