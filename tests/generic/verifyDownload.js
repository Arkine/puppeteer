const waitForFileExists = require('../../helpers/waitForFileExists');

module.exports = async (ctx) => {
    
    // Create chrome developer tools session attached to the target
    const client = await ctx.page.target().createCDPSession();
    // Set the downloads path 
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: ctx.downloadsOutputDir
    });
    
    await ctx.page.goto(ctx.baseUrl);

    await ctx.page.waitForSelector('.main_content', { visible: true, timeout: 10000 });

    const downloadUrl = await ctx.page.evaluate(() => {
        const link = document.evaluate(`//a[text()="Short Selling (csv)"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (link) {
            // Prevent link from opening up in a new tab. Puppeteer won't respect
            // the Page.setDownloadBehavior on the new tab and the file ends up in the
            // default download folder.
            link.target = '';
            link.click();
            return link.href;
        }

        return null;
    });
  
    if (!downloadUrl) {
        console.warn('Did not find a link to download!');

        return ctx;
    }
    
    // Wait for the file response to complete
    await new Promise(resolve => {
        ctx.page.on('response', async resp => {
            if (resp.url() === downloadUrl) {
                resolve();
            }
        });
    });

    console.log('File Downloaded');
  

    await waitForFileExists(`${ctx.downloadsOutputDir}/ShortSelling.csv`);

    console.log('Exists!');

    return ctx;
}