const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { HISTORY_FILE, loadHistory, getLatestSnapshot } = require('../../src/utils/bomHistory');

describe('bomHistory', () => {
  it('has correct filename', () => {
    assert.equal(HISTORY_FILE, '.bomprobe-history.json');
  });

  it('returns empty array for missing dir', () => {
    const result = loadHistory('/nonexistent/dir/xyz');
    assert.deepEqual(result, []);
  });

  it('returns null for latest when empty', () => {
    const result = getLatestSnapshot('/nonexistent/dir/xyz');
    assert.equal(result, null);
  });
});
