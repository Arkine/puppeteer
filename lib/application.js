const pipe = require('./pipe');

class Tester {
    constructor() {
        this._middleware = [];
        this._errors = [];
        this._ctx = {};
    }

    handleError(e) {
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

    handleCompletion() {
        console.log('completed', {...arguments});
    }

    /**
     * Run the middleware
     */
    start() {
        const pipeLine = pipe(this._middleware);

        pipeLine(this._ctx)
            .then(this.handleCompletion)
            .catch(this.handleError);

        return this;
    }
}

module.exports = Tester;