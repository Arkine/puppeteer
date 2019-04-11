/**
 * Compose together the tests to behave like middleware
 * @param {Array} middleware the middleware array to loop over
 */

module.exports = (middleware) => {
    for (const f of middleware) {
        if (typeof f !== 'function') {
            throw new Error('Middleware must be a function!');
        }
    }

    return (ctx, next) => {
        let index = -1;
        function applyFunc(i) {
            index = i;

            let fn = middleware[i];
            if (i === middleware.length) {
                fn = next;
            }
            
            // If we are at the last function, resolve
            if (!fn) {
                return Promise.resolve();
            }
            
            // Iterate through the middleware chain
            try {
                return Promise.resolve(fn(ctx, applyFunc(i + 1)));
            } catch (error) {
                return Promise.reject(error);
            }
        }
        // Initiate the function callcc
        return applyFunc(0)
    }
}