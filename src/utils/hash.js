const crypto = require('node:crypto');
const fs = require('node:fs');

function hashFile(filePath, algorithm = 'sha256') {
  const content = fs.readFileSync(filePath);
  return crypto.createHash(algorithm).update(content).digest('hex');
}

function hashString(str, algorithm = 'sha256') {
  return crypto.createHash(algorithm).update(str).digest('hex');
}

module.exports = { hashFile, hashString };
