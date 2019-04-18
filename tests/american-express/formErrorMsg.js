/**
 * Check the form error message when form isn't properly filled out
 */
const assert = require('assert');

module.exports = async (ctx) => {
    const submitButton = '.application #submit';
    const warningMessage = '.warning-message';

    // Submit the form again
    await ctx.page.click(submitButton);

    // Check the message
    // 'Please make sure that all required fields are complete and valid'
    await ctx.page.waitForSelector(warningMessage);

    const warningText = await ctx.page.$eval(warningMessage, message => message.innerText);

    assert.equal(warningText, 'Please make sure that all required fields are complete and valid');

    return ctx;
}