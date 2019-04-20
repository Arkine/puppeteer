const {URL} = require('url');

module.exports = async ctx => {
    // Catch + "forward" hashchange events from page to node puppeteer.
    await ctx.page.exposeFunction('onHashChange', url => ctx.page.emit('hashchange', url));
    await ctx.page.evaluateOnNewDocument(() => {
        addEventListener('hashchange', e => onHashChange(location.href));
    });
    
    // Listen for hashchange events in node Puppeteer code.
    await ctx.page.on('hashchange', url => console.log('hashchange event:', new URL(url).hash));

    await ctx.page.goto(ctx.baseUrl, { waitUntil: 'domcontentloaded' });
    // await ctx.page.waitForSelector('button > a[href="#test"]');
    // await printVisibleView(ctx.page);

    // "Navigate" to test in SPA. We don't want to wait for the `load` event,
    // so set a small timeout and catch the "navigation timeout".
    try {
        await ctx.page.goto(`${ctx.baseUrl}#test`, { timeout: 1 });
        await ctx.page.goto(`${ctx.baseUrl}#woof`, { timeout: 1 });
    } catch(e) {
        // no op
    }
    
    return ctx;
}