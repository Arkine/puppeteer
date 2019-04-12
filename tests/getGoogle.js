module.exports = async (ctx) => {
	console.log('Google context', ctx);
	await ctx.page.goto('https://google.com', { waitUntil: 'networkidle0' });
	const title = await ctx.page.title();
	assert.equal(title, 'Google');

	return ctx;
}