# WMATA SmarTrip usage data scraper

Inspired by Justin Grimes and Josh Tauberer's [WMATA SmarTrip Usage Python Screen Scraper](https://github.com/justgrimes/WMATA-SmarTrip-Scraper).

If you use SmartBenefits to fund your SmarTrip card, your Card Usage Report Details HTML table will contain an additional row for each usage paid through your benefit showing how much was charged to your benefit and the benefit balance remaining. The `product` column for these rows will look something like "SB Trn Roll F". This scraper handles this in a tidy fashion by duplicating the data from the previous row representing the same usage. This allows you to analyze the usage of your benefit, however, it means you will need to deduplicate the data for some analyses. I have included the year and month in their own columns to make this easier.

## Installation

Clone this repository, then run:

    npm install -g

## Usage

    smartrip

Enter your WMATA username and password when prompted. These will be stored in `~/.wmata` so you won't have to re-enter them.

Then select a card from the list. This card will be stored as your default in `~/.wmata`. You can also specify a card ID on the command line using `--card/-c {CARD_ID}`.

The data will be scraped into `card_{CARD_ID}.csv`.

If you wish to only scrape a specific year and/or month you can use `--year/-y {YEAR}` and `--month/-m {MONTH}`. Month is a 1-indexed integer, so to scrape October 2018 you would run `smartrip --year 2018 --month 10`.

You can save the output to a file by directing stdout to a file:

    smartrip > data.csv

Or you can specify an output file on the command line with `--output/-o`:

    smartrip --output data.csv
