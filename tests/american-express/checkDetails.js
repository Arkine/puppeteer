/**
 * Ensure Card Information in All Cards View is Present on the Card Detail View
 * @param {Object} ctx
 */

const assert = require('assert');

module.exports = async (ctx) => {
	const navPromise = ctx.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    const viewAllCardsBttn = '#content > page-app-container > on-scroll-container > section > main-container > div.aexp-product-filter > div.aexp-product-catagories-and-tiles > div.aexp-product-tiles > div.aexp-product-tiles__item.dls-icon-cashback.active > div.aexp-product-tiles__item-tiles > div:nth-child(3) > div.contentContainer.purify_newBusinessHomeProductTiles__contentContainer--3EQes > div > a';
    // The card categories buttons
    const cardCategories = '#business-credit-cards-v3 > div.sections-container.vac-page-v2.has-filter-title > div.aexp-card-filter.item-count-8.vac-card-filter.has-title > ul > li.item-unit > h2';

    // The rows containg the elements
    const rows = '#business-credit-cards-v3 .aexp-grid-section:nth-of-type(1) > .rows-wrap > .row';

    await ctx.page.goto(ctx.baseUrl, { waitUntil: 'domcontentloaded' });

    await ctx.page.waitForSelector(viewAllCardsBttn);

    await ctx.page.click(viewAllCardsBttn);

    // Have to wait for at least a second because waitForNavigation won't resolve
    // await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await ctx.page.waitFor(1000);

    // Wait for the menu to load
	await ctx.page.waitForSelector(cardCategories);
	
    // Find the Travel Rewards button and click it
    const [travelRewardsBttn] = await ctx.page.$x("//h2[@class='item-label'][contains(text(), 'Travel Rewards')]");
    if (travelRewardsBttn) {
        await ctx.page.evaluate(el => {
            el.click();
        }, travelRewardsBttn);
    }

    await ctx.page.waitFor(1000);

    // Get the column index of the column we will click
	const fee = await ctx.page.$$eval(rows, rowEls => {
		// This maps to the column that we will click
		let colIndex = 0;
		let fee;
		// Get the row with the fees
		const feesRow = rowEls[2];
		// row with the learnMore Bttns
		const bttnRow = rowEls[4];

		// Get all of the fee els and learnmore buttons
		const feeEls = feesRow.querySelectorAll('.fee');
		const learnMoreBttns = bttnRow.querySelectorAll('.learnmore-button');

		// Find which card has no fee and store the index
		if (feeEls.length) {
			for (let i = 0; i < feeEls.length; i++) {
				const re = /(\$[1-9]{1,})/g;

				if (re.test(feeEls[i].innerHTML)) {
					colIndex = i;
					fee = feeEls[i].innerHTML.match(re)[0];
					break;
				}
			}
		}

		// Click the corresponding learn more bttn
		learnMoreBttns[colIndex].click();

		return fee;
	});

	// Wait for the page to navigate
	await navPromise;

	await ctx.page.waitFor(1000);

	// Wait for the fees title
	await ctx.page.waitForSelector('.credit-card-detail h2.aexp-feature-title');

	const detailsFee = await ctx.page.$$eval('.credit-card-detail aexp-feature', features => {
		let index;
		for (let i = 0; i < features.length; i++) {
			const header = features[i].querySelector('h2.aexp-feature-title');
			if (header.innerText === 'Fees') {
				index = i;
				break;
			}
		}

		const header = features[index].querySelector('aexp-feature-header');
		const re = /(\$[1-9]{1,})/g;
		return header.innerHTML.match(re)[0];
	});

	// I wasn't sure whether the assertion should match with casing as well as verbiage so I went for verbiage
	assert.equal(fee.toLowerCase(), detailsFee.toLowerCase());

    await ctx.page.waitFor(1000);

    await ctx.page.screenshot({path: `${ctx.imageOutputDir}/details.png`, fullPage: true});

    return ctx;
}