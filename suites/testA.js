const navigateLogin = require('../tests/navigateLogin');
const getGoogleTitle = require('../tests/getGoogle');
const Piper = require('../lib/application');
const puppeteer = require('puppeteer');

describe('It should navigate to login', () => {
	it('Should do a couple of things', async () => {
		const pipeline = new Piper();

		let browser = await puppeteer.launch({headless: true});
		let page = await browser.newPage();

		// pipeline.set('beforeAll', async () => {
		// 	console.log('before')
		// });

		pipeline.setContext({
			browser,
			page,
			name: 'Test Me',
			baseUrl: 'https://www.americanexpress.com'
		});

		pipeline.all([
			{
				name: '/ GET',
				test: navigateLogin,
			},
			{
				name: 'Should get google title',
				test: getGoogleTitle
			}
		])

		pipeline.start();
	})
});
