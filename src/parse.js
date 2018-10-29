const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment-timezone')

let parseCards = (html) => {
	let $ = cheerio.load(html);
	let cards = []
	$('li.cardInfo a').each(function(i, el) {
		cards.push({id: $(this).attr('href').match(/card_id=([0-9]+)/)[1], text: $(this).text()})
	})
	return cards
}

let parseTable = (html) => {
	let $ = cheerio.load(html);
	let data = [];
	$('table#ctl00_MainContent_lvUsageReport_Table1 tr').each(function(i, el) {
		let row = [];
		$(this).children().each(function(i, el) {
			row.push($(this).text())
		});
		data.push(row);
	});

	let processedData = data.filter(d => d[0] !== 'Seq.#').reduce((prev, curr) => {
		if (curr.length === 9) {
			let time = moment.tz(curr[1], 'MM/DD/YY hh:mm A', 'America/New_York').toISOString();
			prev.push({
				seq: +curr[0],
				time,
				description: curr[2],
				operator: curr[3],
				entryOrBusRoute: curr[4],
				exitLocation: curr[5],
				product: curr[6],
				change: +curr[7],
				balance: +curr[8]
			})
		} else if (curr.length === 3) {
			prev.push(Object.assign(Object.assign({}, prev[prev.length - 1]), {product: curr[0], change: curr[1], balance: curr[2]}))
		} else {
			console.error('WAT', curr);
		}
		return prev;
	}, []);

	return processedData;
}

module.exports = { parseCards, parseTable }
