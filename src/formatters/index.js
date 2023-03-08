const text = require('./text');
const json = require('./json');
const markdown = require('./markdown');
const csv = require('./csv');
const summary = require('./summary');
const sarif = require('./sarif');

const formatters = { text, json, markdown, csv, summary, sarif };

function getFormatter(name) {
  return formatters[name] || null;
}

function listFormatters() {
  return Object.keys(formatters);
}

module.exports = { getFormatter, listFormatters };
