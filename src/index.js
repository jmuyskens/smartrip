const fs = require('fs');
const inquirer = require('inquirer');
const puppeteer = require('puppeteer');
const stringify = require('csv-stringify');

const {loadConfig, writeConfig} = require('./config');
const {login, scrapeCards, scrapeMonth, scrapeData} = require('./wmataDotCom');

const prompt = inquirer.createPromptModule({ output: process.stderr })

const cardUsageHistory = async (args) => {
	const browser = await puppeteer.launch({headless: !args.showBrowser});
	let config = loadConfig();

	if (!config.username || !config.password) {
		let response = await prompt([
      {
        type: 'input',
        name: 'username',
        message: 'WMATA username'
      },
			{
				type: 'password',
				name: 'password',
				message: 'password'
			}
		]);

		config = Object.assign(config, response);
		writeConfig(config);
	}

	const page = await login(browser, config.username, config.password);

	const cards = await scrapeCards(page);

	if (!args.card) {
		let defaultIdx = 0;
		if (config.card) {
			defaultIdx = cards.map(card => card.id).indexOf(config.card);
		}
		let response = await prompt([
      {
        type: 'list',
        name: 'card',
        message: 'Which card would you like to view usage history for?',
        choices: cards.map(d => d.text),
        default: defaultIdx
      }
		]);
		args.card = cards.filter(card => card.text === response.card)[0].id;
		config = Object.assign(config, {card: args.card});
		writeConfig(config);
	}

	let data = await scrapeData(page, args);

	let csvOutput = stringify(data, { header: true })

	if (args.output) {
		csvOutput.pipe(fs.createWriteStream(args.output))
	} else {
		csvOutput.pipe(process.stdout)
	}
	
	await browser.close();
}

module.exports = cardUsageHistory;
