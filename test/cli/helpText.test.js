const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getHelpText, getVersionText } = require('../../src/cli/helpText');

describe('CLI help text', () => {
  it('includes version', () => {
    assert.ok(getHelpText().includes('bomprobe v'));
  });

  it('includes usage line', () => {
    assert.ok(getHelpText().includes('Usage:'));
  });

  it('includes all major flags', () => {
    const help = getHelpText();
    assert.ok(help.includes('--format'));
    assert.ok(help.includes('--preset'));
    assert.ok(help.includes('--threshold'));
    assert.ok(help.includes('--compliance'));
    assert.ok(help.includes('--watch'));
    assert.ok(help.includes('--diff'));
  });

  it('includes examples', () => {
    assert.ok(getHelpText().includes('Examples:'));
  });

  it('version text matches package', () => {
    const pkg = require('../../package.json');
    assert.ok(getVersionText().includes(pkg.version));
  });

  it('lists output formats', () => {
    assert.ok(getHelpText().includes('sarif'));
    assert.ok(getHelpText().includes('junit'));
  });
});
