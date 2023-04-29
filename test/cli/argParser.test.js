const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseArgs } = require('../../src/cli/argParser');

describe('argParser', () => {
  it('parses long flags with values', () => {
    const r = parseArgs(['--format', 'json', '--threshold', '80']);
    assert.equal(r.flags.format, 'json');
    assert.equal(r.flags.threshold, '80');
  });

  it('parses boolean flags', () => {
    const r = parseArgs(['--verbose', '--stats']);
    assert.equal(r.flags.verbose, true);
    assert.equal(r.flags.stats, true);
  });

  it('parses --no- prefix as false', () => {
    const r = parseArgs(['--no-color']);
    assert.equal(r.flags.color, false);
  });

  it('converts kebab-case to camelCase', () => {
    const r = parseArgs(['--fail-on', 'error']);
    assert.equal(r.flags.failOn, 'error');
  });

  it('collects positional files', () => {
    const r = parseArgs(['bom.json', '--format', 'text', 'sbom.json']);
    assert.deepEqual(r.files, ['bom.json', 'sbom.json']);
  });

  it('handles short flags', () => {
    const r = parseArgs(['-o', 'report.txt', '-v']);
    assert.equal(r.flags.o, 'report.txt');
    assert.equal(r.flags.v, true);
  });

  it('stops at --', () => {
    const r = parseArgs(['--format', 'json', '--', 'extra.json']);
    assert.equal(r.flags.format, 'json');
    assert.deepEqual(r.files, ['extra.json']);
  });
});
