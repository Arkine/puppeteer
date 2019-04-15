module.exports = async (ctx) => {
    await ctx.page.setRequestInterception(true);

    ctx.page.on('request', request => {
        if (ctx.resources.includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });

    await ctx.page.goto(ctx.baseUrl);

    await ctx.page.screenshot({'path': `${ctx.imageOutputDir}/no-images.png`});
    
    return ctx;
}