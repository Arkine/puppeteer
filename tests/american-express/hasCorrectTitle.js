const assert = require('assert');
/**
 * Check the page title of google.com
 * @param {Objext} ctx
 */
module.exports = async (ctx) => {
	await ctx.page.goto(ctx.baseUrl, { waitUntil: 'networkidle0' });

	const title = await ctx.page.title();
	assert.equal(title, 'American Express Credit Cards, Rewards, Travel and Business Services');

	return ctx;
}