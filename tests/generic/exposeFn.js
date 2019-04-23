const fs = require('fs');

module.exports = async ctx => {
    ctx.page.on('console', msg => console.log(msg.text()));

    await ctx.page.exposeFunction('readfile', async filePath => {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, text) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(text);
                }
            });
        });
    });

    await ctx.page.evaluate(async () => {
        const content = await window.readfile('/etc/hosts');
        console.log(content);
    });
    
    return ctx;
}