const navigateLogin = require('../tests/navigateLogin');

module.exports = async (ctx, next) => {
    // console.log('testA',{ctx, next});
    await navigateLogin(ctx);

    next();
}