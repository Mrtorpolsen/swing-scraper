# Swing Scraper

A web scraper for collecting and structuring playground equipment data.

## About

Swing Scraper was built to automate the collection of playground equipment
data from three different playground equipment sites. Instead of manually collecting information from individual
product pages, the scraper navigates the website, extracts the relevant data,
and exports the results to an Excel spreadsheet.

## How it works

The scraper uses Crawlee to manage crawling and Cheerio to parse the HTML.

1. Crawl the relevant pages
2. Extract product information
3. Parse and normalize the data
4. Export the results using ExcelJS

## Tech Stack

- TypeScript
- Crawlee
- Cheerio
- ExcelJS
