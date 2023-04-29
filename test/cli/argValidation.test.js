const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateArgs, expandShortFlags } = require('../../src/cli/argValidation');

describe('argValidation', () => {
  it('passes valid args with file', () => {
    const r = validateArgs({ files: ['bom.json'], flags: { format: 'json' } });
    assert.ok(r.valid);
  });

  it('errors on no files and no help flags', () => {
    const r = validateArgs({ files: [], flags: { format: 'json' } });
    assert.ok(!r.valid);
    assert.ok(r.errors[0].includes('No input'));
  });

  it('allows no files with --help', () => {
    const r = validateArgs({ files: [], flags: { help: true } });
    assert.ok(r.valid);
  });

  it('warns on unknown flags', () => {
    const r = validateArgs({ files: ['x.json'], flags: { banana: true } });
    assert.ok(r.warnings.length > 0);
  });

  it('expands short flags', () => {
    const parsed = { files: ['x.json'], flags: { f: 'json', v: true, o: 'out.txt' } };
    const expanded = expandShortFlags(parsed);
    assert.equal(expanded.flags.format, 'json');
    assert.equal(expanded.flags.verbose, true);
    assert.equal(expanded.flags.output, 'out.txt');
    assert.ok(!expanded.flags.f);
  });

  it('allows --list-checks without files', () => {
    const r = validateArgs({ files: [], flags: { listChecks: true } });
    assert.ok(r.valid);
  });
});
