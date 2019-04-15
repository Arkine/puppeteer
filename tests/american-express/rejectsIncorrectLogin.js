module.exports = async (ctx) => {
    await ctx.page.goto(`https://global.americanexpress.com/login?inav=iNavLnkLog`, {waitUntil: 'networkidle0'})
    await ctx.page.type('#eliloUserID', ctx.user.username)
    await ctx.page.type('#eliloPassword', ctx.user.password)
    await ctx.page.click('#root > div:nth-child(1) > div > div:nth-child(2) > div > div > div.body > div.container.pad-1-tb > div > section > div.row.flex-justify-center > div.col-xs-12.col-md-6.col-lg-4.margin-b-md-down > div > div > div > form > button');

    // await ctx.page.waitForNavigation({ waitUntil: 'networkidle0'});
    // const resp = await ctx.page.waitForResponse();
    // error message doesn't display unless we add a delay
    await ctx.page.waitFor(3000);
    // await ctx.page.waitForSelector('#root > div:nth-child(1) > div > div:nth-child(2) > div > div > div.body > div.container.pad-1-tb > div > section > div.row.flex-justify-center > div.col-xs-12.col-md-6.col-lg-4.margin-b-md-down > div > div > div:nth-child(1) > div > div')
    await ctx.page.screenshot({ path: `${ctx.imageOutputDir}/failed-login.png` });
    return ctx;
}