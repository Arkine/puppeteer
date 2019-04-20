/*
User Journey: Ensure Invalid Email Address on Card Application Fails with Correct Error Messages

Navigate to http://open.com/, follow any redirects
If a modal is displayed (e.g. "Get more information to help you choose a program..."), bypass this by choose "X" or "I'm not interested."
Choose "View All Cards" under "Secure funding for your business" and the "Business Cards" sub column
Notice a list of business cards are shown
Choose "Apply" for the first card shown
Notice the card application form is shown
Input an invalid email address (e.g. "invalidemail") under the "Email Address" field
Expect/Assert an inline error is shown relative to the field which reads "Your Email Address is missing the @ symbol")
Choose "Continue" at the end of the form without filling in any other fields
Expect/Assert the form to fail submission and present the error text at the top of the form which reads "Please make sure that all required fields are complete and valid"
*/
const assert = require('assert');
const getBoundingBox = require('../../helpers/getBoundingRect');

module.exports = async (ctx) => {
	const viewAllCardsSelector = '#content > page-app-container > on-scroll-container > section > main-container > div.aexp-product-filter > div.aexp-product-catagories-and-tiles > div.aexp-product-tiles > div.aexp-product-tiles__item.dls-icon-cashback.active > div.aexp-product-tiles__item-tiles > div:nth-child(3) > div.contentContainer.purify_newBusinessHomeProductTiles__contentContainer--3EQes > div > a';
	const submitButton = '.application-main #submit';
	const warningMessage = '.warning-message';

	const navPromise = ctx.page.waitForNavigation({ waitUntil: 'domcontentloaded' });

	// Wait for navigation to the home page
	await ctx.page.goto(ctx.baseUrl, { waitUntil: 'domcontentloaded' });

	// Wait for the cards selector to appear
	await ctx.page.waitForSelector(viewAllCardsSelector);

	// Click the cards selector
	await ctx.page.click(viewAllCardsSelector);

	// Wait for page to respond
	await ctx.navPromise;

	// wait for the apply button to appear
	await ctx.page.waitForSelector('.aexp-grid-section .row .apply-button');

	// Find the first card's apply button and click it
	await ctx.page.$$eval('.aexp-grid-section .row .apply-button', applyBttns => {
		if (applyBttns.length) {
			applyBttns[0].click();
		}
	});

	// Wait for the page to navigate
	await navPromise;

	// Wait for the email field to appear
	await ctx.page.waitForSelector('.application-form-wrapper .email input[type="email"]');

	// Type in the bad user email
	await ctx.page.type('.application-form-wrapper .email input[type="email"]', ctx.testUser.email);

	// Click the submit bttn;
	await ctx.page.click(submitButton);

	// Wait for the page to respond
	// await page.waitFor(1000);

	// Wait for the inputError to appear
	await ctx.page.waitForSelector('.application-form-wrapper .email .input-errors > span');

	// Find the error that matches our expected error
	const error = await ctx.page.$$eval('.application-form-wrapper .email .input-errors > span', inputErrors => {
		let found;
		inputErrors.forEach(err => {
			if (err.innerText === 'Your Email Address is missing the @ symbol') {
				found = err.innerText;
			}
		});

		return found;
	});

	// Assert that this is the value we are expecting
	assert.equal(error, 'Your Email Address is missing the @ symbol');

	await ctx.page.click(submitButton);

	await ctx.page.waitFor(1000);

	// Check the message
	// 'Please make sure that all required fields are complete and valid'
	await ctx.page.waitForSelector(warningMessage);

	const warningText = await ctx.page.$eval(warningMessage, message => message.innerText);
	
	const rect = await getBoundingBox(warningMessage, ctx.page);
	await ctx.page.screenshot({ 
		path: `${ctx.imageOutputDir}/formfail-clipped.png`,
		clip: {
			x: rect.left - 16,
			y: rect.top + 16,
			width: rect.width + 16 * 2,
			height: rect.height + 16 * 2,
		}
	});
	
	assert.equal(warningText, 'Please make sure that all required fields are complete and valid');

    return ctx;
}