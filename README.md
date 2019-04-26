# Puppeteer testing
Testing some concepts on how I can make a scalable and easy to use testing framework with Puppeteer

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

                    return ctx;
                },
                after: (ctx) => {
                    ...
                    return ctx;
                }
            }
        ]);

        // Initiate the tests
        tester.start();
    });
})
```

## API
1. ```new Pipeline(options: Object): Pipeline```: Constructor function that takes in the settings of the pipeline itself
    - ```name: String = '----'```: The name of the test suite.
    - ```tests: Array[Object] = []```: The tests to be performed.
    - ```beforeAll: Function = done => done()```: The function to be ran before all tests.
    - ```afterAll: Function = done => done()```: Function to be ran after all tests have completed.
2. ```setContext(ctx: Object):ctx```: Set the testing context properties
3. ```before(ctx: Object):ctx```: The function to be called before the test. Takes in a ctx object and returns that object to be used in the test iteself.
4. ```test(ctx: Object):ctx```: The test to be performed. Retuns the ctx to be used in the ```after``` function
5. ```after(ctx: Object):ctx```: The functions to be run after the test has completed. returns the ctx to the next item in the pipeline.
6. ```start(): Pipeline```: Begin the tests;
7. ```set(key: String): String```: Sets the property value on the class
8. ```use: Function = () => {}```: Insert an individual test