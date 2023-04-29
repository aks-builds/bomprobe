const { readFileSync, writeFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const HISTORY_FILE = '.bomprobe-history.json';

function loadHistory(dir) {
  const path = join(dir, HISTORY_FILE);
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf8'));
}

function saveHistory(dir, history) {
  const path = join(dir, HISTORY_FILE);
  writeFileSync(path, JSON.stringify(history, null, 2));
}

function appendSnapshot(dir, snapshot) {
  const history = loadHistory(dir);
  history.push(snapshot);
  saveHistory(dir, history);
  return history.length;
}

function getLatestSnapshot(dir) {
  const history = loadHistory(dir);
  return history.length > 0 ? history[history.length - 1] : null;
}

module.exports = { loadHistory, saveHistory, appendSnapshot, getLatestSnapshot, HISTORY_FILE };
