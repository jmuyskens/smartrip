const {parseTable, parseCards} = require('./parse');

const login = async (browser, username, password) => {
	const page = await browser.newPage();
	await page.goto('https://smartrip.wmata.com/Account/AccountLogin.aspx');
	await page.type( '#ctl00_ctl00_MainContent_MainContent_txtUsername', username);
	await page.type( '#ctl00_ctl00_MainContent_MainContent_txtPassword', password);
	page.click('#ctl00_ctl00_MainContent_MainContent_btnSubmit');
	await page.waitForNavigation();
	return page;
}

const scrapeCards = async(page) => {
  let accountSummaryHTML = await page.content();
	return parseCards(accountSummaryHTML);
}

const scrapeMonth = async (page, card, year, month) => {
	let timePeriod = `${year}${String(month).padStart(2, '0')}`
	let url = `https://smartrip.wmata.com/Card/CardUsageHistoryPrint.aspx?card_id=${card}&period=M&month=${timePeriod}&transactionstatus=Successful&orderby=transactiondatetime&ordertype=`
	await page.goto(url)
	let html = await page.content()
	let data = parseTable(html);
  data = data.map(d => Object.assign(d, {year, month, card}));
	return data;
}

const scrapeData = async (page, args) => {
	await page.goto(`https://smartrip.wmata.com/Card/CardSummary.aspx?card_id=${args.card}`);
	await page.goto(`https://smartrip.wmata.com/Card/CardUsageReport.aspx?card_id=${args.card}`)
	await page.click('#ctl00_ctl00_MainContent_MainContent_btnSubmit');

	let data = [];

	for (let year = 2015; year <= 2018; year++) {
		if (args.year) {
			year = args.year;
		}
		for (let month = 1; month <= 12; month++) {
			if (args.month) {
				month = args.month;
			}
			let monthData = await scrapeMonth(page, args.card, year, month);
			data = data.concat(monthData);
			if (args.month) {
				break;
			}
		}
		if (args.year) {
			break;
		}
	}

	return data;
}

module.exports = {login, scrapeCards, scrapeMonth, scrapeData};
