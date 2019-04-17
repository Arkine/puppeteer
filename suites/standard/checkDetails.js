const puppeteer = require('puppeteer');
const path = require('path');
const assert = require('assert');

const baseUrl = 'http://open.com';

describe("American Express Cards", () => {
    let page;
    let browser;

    // the homepage buttons
    const viewAllCardsBttn = '#content > page-app-container > on-scroll-container > section > main-container > div.aexp-product-filter > div.aexp-product-catagories-and-tiles > div.aexp-product-tiles > div.aexp-product-tiles__item.dls-icon-cashback.active > div.aexp-product-tiles__item-tiles > div:nth-child(3) > div.contentContainer.purify_newBusinessHomeProductTiles__contentContainer--3EQes > div > a';

	// The card categories buttons
    const cardCategories = '#business-credit-cards-v3 > div.sections-container.vac-page-v2.has-filter-title > div.aexp-card-filter.item-count-8.vac-card-filter.has-title > ul > li.item-unit > h2';

    // The rows containg the elements
    const rows = '#business-credit-cards-v3 .aexp-grid-section:nth-of-type(1) > .rows-wrap > .row';


    before(async () => {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
    });

    it("Should contain proper details", async () => {
		const navPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded' });

        // Navigate the the home page
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

        // Wait for the cards button to appear
        await page.waitForSelector(viewAllCardsBttn);

        // Click the card view all cards button
        await page.click(viewAllCardsBttn);

		// Have to wait for at least a second because waitForNavigation won't resolve
		await navPromise;
        // await page.waitForNavigation({ waitUntil: 'networkidle0' })
        // await page.waitFor(1000);

        // Wait for the menu to load
        await page.waitForSelector(cardCategories);

        // Find the Travel Rewards button and click it
        const [travelRewardsBttn] = await page.$x("//h2[@class='item-label'][contains(text(), 'Travel Rewards')]");
        if (travelRewardsBttn) {
            await page.evaluate(el => {
                el.click();
            }, travelRewardsBttn);
        }

        // Wait for the page to update
		// await page.waitFor(1000);
		await page.waitForSelector(rows);

        // Get the column index of the column we will click
        const fee = await page.$$eval(rows, rowEls => {
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
					const re = /(\$[1-9]{1,} Annual Fee)/g;

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

		// Wait for the fees title
		await page.waitForSelector('.credit-card-detail h2.aexp-feature-title');

		const detailsFee = await page.$$eval('.credit-card-detail aexp-feature', features => {
			let index;
			for (let i = 0; i < features.length; i++) {
				const header = features[i].querySelector('h2.aexp-feature-title');
				if (header.innerText === 'Fees') {
					index = i;
					break;
				}
			}

			const header = features[index].querySelector('aexp-feature-header');
			return header.innerText;
		});

		// I wasn't sure whether the assertion should match with casing as well as verbiage so I went for verbiage
		assert.equal(fee.toLowerCase(), detailsFee.toLowerCase());

        await page.screenshot({path: `${path.join(__dirname, '../../tests/american-express/screenshots/')}/details2.png`, fullPage: true});

    }).timeout(0);

    after(async () => {
        await browser.close();
    })
})