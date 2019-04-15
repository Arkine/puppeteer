const assert = require('assert');
/**
 * Check the page title of google.com
 * @param {Objext} ctx 
 */
module.exports = async (ctx) => {
	await ctx.page.goto('https://google.com', { waitUntil: 'networkidle0' });
	
	const title = await ctx.page.title();
	assert.equal(title, 'Google');

	return ctx;
}