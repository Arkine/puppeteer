const assert = require('assert');

/**
 * Check if the login button redirects to the login page
 * @param {Object} ctx 
 */
module.exports = async (ctx) => {

    // Goto the AE homepage
    await ctx.page.goto(`${ctx.baseUrl}/us/credit-cards/business`);

    // Wait for the login bttn to appear
    await ctx.page.waitForSelector('#gnav_login', { visible: true });
    
    // Click the login bttn
    await ctx.page.click('#gnav_login');

    // Causes timeout. maybe because it's react?
    // await ctx.page.waitForNavigation();

    const title = await ctx.page.title();
    assert.equal(title, 'American Express - Login');

    await ctx.page.screenshot({path: `${ctx.imageOutputDir}/login-page.png`});

	return ctx;
}