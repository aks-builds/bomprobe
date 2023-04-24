const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseIgnoreFile, shouldIgnore, filterFindings } = require('../../src/config/ignorePatterns');

describe('ignore patterns', () => {
  it('parses ignore file lines', () => {
    const patterns = parseIgnoreFile('lodash\n# comment\nexpress\n\naxios');
    assert.equal(patterns.length, 3);
  });

  it('matches exact name', () => {
    const patterns = parseIgnoreFile('lodash');
    assert.equal(shouldIgnore('lodash', patterns), true);
    assert.equal(shouldIgnore('express', patterns), false);
  });

  it('matches wildcard pattern', () => {
    const patterns = parseIgnoreFile('@babel/*');
    assert.equal(shouldIgnore('@babel/core', patterns), true);
    assert.equal(shouldIgnore('@babel/preset-env', patterns), true);
    assert.equal(shouldIgnore('babel', patterns), false);
  });

  it('matches question mark wildcard', () => {
    const patterns = parseIgnoreFile('lib?');
    assert.equal(shouldIgnore('lib1', patterns), true);
    assert.equal(shouldIgnore('libs', patterns), true);
    assert.equal(shouldIgnore('lib12', patterns), false);
  });

  it('filters findings by component name', () => {
    const patterns = parseIgnoreFile('lodash');
    const findings = [
      { component: 'lodash', severity: 'warning', message: 'w' },
      { component: 'express', severity: 'error', message: 'e' }
    ];
    const filtered = filterFindings(findings, patterns);
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].component, 'express');
  });

  it('returns all findings when no patterns', () => {
    const findings = [{ component: 'a' }, { component: 'b' }];
    assert.equal(filterFindings(findings, []).length, 2);
  });

  it('is case insensitive', () => {
    const patterns = parseIgnoreFile('Lodash');
    assert.equal(shouldIgnore('lodash', patterns), true);
    assert.equal(shouldIgnore('LODASH', patterns), true);
  });
});
