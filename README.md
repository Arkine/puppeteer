# Puppeteer testing
Testing some concepts on how I can make scalable and easy to use testing framework with Puppeteer

## Tools
- Puppeteer
- Mocha
- Chai

## Getting started
Create a test suite
```javascript
describe('example.com test', () => {
    it('Login form', () => {
        // Initiate the test object
        const tester = new Tester({
            name: 'my test'
        });

        // Add the test steps
        tester.addTests([
            {
                name: 'Valid User login',
                before: (ctx) = {
                    ctx.user = {
                        username: 'joe',
                        password: 'doe'
                    }

                    return ctx;
                },
                test: (ctx) => {
                    ...
                },
                after: (ctx) => {
                }
            },
            {
                name: 'Invalid user login',
                before: (ctx) = {
                    ctx.user = {
                        username: 'dog',
                        password: 'woof'
                    }

                    return ctx;
                },
                test: (ctx) => {
                    ...
                },
                after: (ctx) => {
                }
            }
        ]);

        // Initiate the tests
        tester.start();
    });
})
```