const puppeteer = require('puppeteer');
const path = require('path');

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
        // Navigate the the home page
        await page.goto('http://open.com', { waitUntil: 'domcontentloaded' });

        // Wait for the cards button to appear
        await page.waitForSelector(viewAllCardsBttn);

        // Click the card view all cards button
        await page.click(viewAllCardsBttn);

        // Have to wait for at least a second because waitForNavigation won't resolve
        // await page.waitForNavigation({ waitUntil: 'networkidle0' })
        await page.waitFor(1000);
        
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
        await page.waitFor(1000);

        // Get the column index of the column we will click
        await page.$$eval(rows, rowEls => {
            // This maps to the column that we will click
            let colIndex = 0;
            
            // Get the row with the fees
            const feesRow = rowEls[2];
            // row with the learnMore Bttns
            const bttnRow = rowEls[4];
            
            // Get all of the fee els and learnmore buttons
            const feeEls = feesRow.querySelectorAll('.fee');
            const learnMoreBttns = bttnRow.querySelectorAll('.learnmore-button');

            // Find which card has no fee and store the index
            if (feeEls.length) {
                for (let i = 0; i < feeEls.length; i++) {``
                    if (/\$[1-9]{1,}/g.test(feeEls[i].innerText)) {
                        colIndex = i;
                        break;
                    }
                }
            }

            // Click the corresponding learn more bttn
            learnMoreBttns[colIndex].click();
        });

        // Wait for page to respond
        await page.waitFor(1000);

        await page.screenshot({path: `${path.join(__dirname, '../../tests/american-express/screenshots/')}/details2.png`, fullPage: true});

    }).timeout(0);

    after(async () => {
        await browser.close();
    })
})