const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-timestamp-format');

describe('metadata-timestamp-format check', () => {
  it('passes valid ISO timestamp', () => {
    const sbom = { metadata: { timestamp: '2023-04-26T10:00:00Z' } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags non-ISO format', () => {
    const sbom = { metadata: { timestamp: 'April 26, 2023' } };
    assert.equal(check.run(sbom).length, 1);
    assert.equal(check.run(sbom)[0].severity, 'warning');
  });

  it('flags future timestamp', () => {
    const future = new Date(Date.now() + 172800000).toISOString();
    const sbom = { metadata: { timestamp: future } };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('future'));
  });

  it('ignores missing timestamp', () => {
    assert.equal(check.run({ metadata: {} }).length, 0);
    assert.equal(check.run({}).length, 0);
  });
});
