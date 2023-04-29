const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatCodeQuality } = require('../../src/output/gitlabCodeQuality');

describe('gitlab code quality output', () => {
  it('formats findings as code quality issues', () => {
    const results = [{ id: 'comp-name', name: 'Component Name', findings: [
      { severity: 'error', message: 'Missing name', component: 'lib' }
    ]}];
    const json = JSON.parse(formatCodeQuality(results));
    assert.equal(json.length, 1);
    assert.equal(json[0].check_name, 'comp-name');
    assert.equal(json[0].severity, 'critical');
  });

  it('maps warning to major severity', () => {
    const results = [{ id: 'comp-ver', name: 'Version', findings: [
      { severity: 'warning', message: 'Loose' }
    ]}];
    const json = JSON.parse(formatCodeQuality(results));
    assert.equal(json[0].severity, 'major');
  });

  it('maps info to minor', () => {
    const results = [{ id: 'x', name: 'X', findings: [
      { severity: 'info', message: 'Note' }
    ]}];
    const json = JSON.parse(formatCodeQuality(results));
    assert.equal(json[0].severity, 'minor');
  });

  it('returns empty array for no findings', () => {
    const json = JSON.parse(formatCodeQuality([{ id: 'a', findings: [] }]));
    assert.equal(json.length, 0);
  });

  it('includes fingerprint', () => {
    const results = [{ id: 'comp-name', name: 'CN', findings: [
      { severity: 'error', message: 'Missing' }
    ]}];
    const json = JSON.parse(formatCodeQuality(results));
    assert.ok(json[0].fingerprint);
    assert.ok(json[0].fingerprint.length >= 8);
  });
});
