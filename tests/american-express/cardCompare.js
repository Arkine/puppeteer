module.exports = async ctx => {
    const navPromise = ctx.page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    const viewAllCardsSel = '#content > page-app-container > on-scroll-container > section > main-container > div.aexp-product-filter > div.aexp-product-catagories-and-tiles > div.aexp-product-tiles > div.aexp-product-tiles__item.dls-icon-cashback.active > div.aexp-product-tiles__item-tiles > div:nth-child(3) > div.contentContainer.purify_newBusinessHomeProductTiles__contentContainer--3EQes > div > a';
    const cardCategories = '#business-credit-cards-v3 > div.sections-container.vac-page-v2.has-filter-title > div.aexp-card-filter.item-count-8.vac-card-filter.has-title > ul > li.item-unit > h2';
    const noFeesSel = '#business-credit-cards-v3 > div.sections-container.vac-page-v2.tray-visible.has-filter-title > div.aexp-card-filter.item-count-8.vac-card-filter.has-title > ul > li.item-unit > h2';
    // welcome offer bttn
    const cardDataRowsSel = '.aexp-grid-section > .rows-wrap > .row';

    const noAnnualFeeXp = '//h2[@class="item-label"][contains(text(), "No Annual Fee")]';

    // Goto open.com
    await ctx.page.goto(ctx.baseUrl, { waitUntil: 'domcontentloaded' } );

    // Choose "View All Cards" under "Secure funding for your business" and the "Business Cards" sub column
    await ctx.page.waitForSelector(viewAllCardsSel);

    await Promise.all([
        navPromise,
        ctx.page.click(viewAllCardsSel)
    ]);

    await ctx.page.waitForSelector(cardCategories);
    await ctx.page.waitForXPath(noAnnualFeeXp);

    const [noAnnualFeeBttn] = await ctx.page.$x(noAnnualFeeXp);
    console.log('noa', noAnnualFeeBttn)
    await ctx.page.evaluate(feeBttn => {
        feeBttn.click();
    }, noAnnualFeeBttn);


    await ctx.page.waitFor(2000);

    
    // Choose "No Annual Fee" from the sub menu
    // await ctx.page.click(noFeesSel);

    await ctx.page.waitFor(1000);

    // Choose "Add to Compare" for each business card that reads "$0 Annual Fee" and has a "Welcome Offer"

    // Check if the row has a welcome offer button and then find that colums compare bttn
   const found = await ctx.page.$$eval(cardDataRowsSel, rows => {
        let colIndexes = [];
        let foundBttns = 0;

        for (let i = 0; i < rows.length; i++) {
            if (colIndexes.length <= 2) {
                if (rows[i].querySelector('a.offer-button')) {
                    colIndexes.push(i);
                }
            } else {
                break;
            }
        }
        // Iterate through the rows to click the compare buttons
        if (colIndexes.length) {
            for (let index of colIndexes) {
                const addToCompareBttn = rows[index].querySelector('add-to-compare-button');

                if (addToCompareBttn) {
                    foundBttns++;
                    addToCompareBttn.click();
                }
            }
        }

        // console.log('Found', foundBttns);

        return foundBttns;
    });

    console.log('buttons found', found);



    // Remember the selected cards' names (e.g. "Amazon Business Card"), they will be used to verify later in this journey

    // Remember the selected cards' names (e.g. "Amazon Business Card"), they will be used to verify later in this journey

    // Compare against the previously remember card names (e.g. "Amazon Business Card")


    return ctx;
}