module.exports = async (ctx) => {
    // console.log({ctx})
    await ctx.page.emulate(ctx.device);

    await ctx.page.goto(`${ctx.baseUrl}/login`, { waitUntil: 'domcontentloaded' });

    // This isn't necessary with emulate
    // await ctx.page.setViewport(ctx.viewport);
    
    const filename = `${ctx.device.name.split(' ').join('-').toLowerCase()}.png`;

    await ctx.page.screenshot({ path: `${ctx.imageOutputDir}/${filename}` });

    return ctx;
}