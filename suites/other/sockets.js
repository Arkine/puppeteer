const Piper = require('../../lib/application');
const puppeteer = require('puppeteer');
const connect = require('../../tests/generic/connect');

const setContext = async ctx => {
    ctx.browser = await puppeteer.launch({ headless: true });
    ctx.page = await ctx.browser.newPage();

    return ctx;
}

const closeBrowser = async ctx => {
    await ctx.browser.close();
}

describe("websocket.org", () => {
    /**
     * TODO Figure out the websocket url
     */
    it("Should re-connect with websockets", () => {
        const pipeline = new Piper({
            name: 'Socket persistance test'
        });

        pipeline.setContext({
            baseUrl: 'https://www.websocket.org/echo.html',
            wsUrl: 'wss://echo.websocket.org'
        });

        pipeline.addTests([
            {
                before: async (ctx) => {
                    if (!ctx.wsUrl) {
                        ctx.browser = await puppeteer.launch({
                            handleSIGINT: false, // so Chrome doesn't exit when we quit Node.
                            headless: true
                        });
                    } else {
                        ctx.browser = await puppeteer.connect({browserWSEndpoint: ctx.wsUrl});
                        ctx.page = await ctx.browser.newPage();
                    }
                    return ctx;
                },
                test: connect,
                after: closeBrowser
            }
        ]);

        pipeline.start();
    });
});