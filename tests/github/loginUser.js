module.exports = async (ctx) => {
    await ctx.page.goto(`${ctx.baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await ctx.page.type('#login_field', ctx.user.username);
    await ctx.page.type('#password', ctx.user.password);

    // await ctx.page.click('#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block');

    // await ctx.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    // This method is better at preventing race condition timeouts
    await Promise.all([
        await ctx.page.click('#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block'),

        await ctx.page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ])
    
    await ctx.page.screenshot({ path: `${ctx.imageOutputDir}/login-success.png` });
    
    return ctx;
}