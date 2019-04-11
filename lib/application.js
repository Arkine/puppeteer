const pipe = require('./pipe');
const context = require('./context');

class Tester {
    constructor() {
        this._middleware = [];
        this._errors = [];
        this._ctx = context;
        this._results = [];

        this.handleError = this.handleError.bind(this);
        this.handleCompletion = this.handleCompletion.bind(this);
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

    handleCompletion() {
        return this._results;
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
}

module.exports = Tester;