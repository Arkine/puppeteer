/**
 * Get the bounding box of an element
 * @param {String} selector 
 * @param {Object} page 
 */
module.exports = async (selector, page) => {
    return await page.evaluate(selector => {
        const el = document.querySelector(selector);
        const {x, y, width, height} = el.getBoundingClientRect();

        return {left: x, top: y, width, height, id: el.id};
    }, selector);
};