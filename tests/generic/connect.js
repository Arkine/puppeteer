const path = require('path');

module.exports = async (ctx) => {

    console.log('1. Quit this script (cmd/ctrl+C).');
    console.log('2. Chrome will still be running.');
    console.log('4. Re-return the script with:');
    console.log(`   wsURL=${ctx.browser.wsEndpoint()} node ${path.basename(__filename)}`);
    console.log('5. Puppeteer will reconnect to the existing Chrome instead of launching a new browser.');
    
    
    console.log('Reconnecting to existing Chrome....');

    await ctx.page.goto(ctx.baseUrl);

    console.log(`Page title:`, await ctx.page.title());

    return ctx;
}