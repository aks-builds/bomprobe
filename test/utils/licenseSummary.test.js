const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { summarizeLicenses } = require('../../src/utils/licenseSummary');

describe('license summary', () => {
  it('counts license types', () => {
    const sbom = { components: [
      { name: 'a', license: 'MIT' },
      { name: 'b', license: 'GPL-3.0-only' },
      { name: 'c', license: null }
    ]};
    const summary = summarizeLicenses(sbom);
    assert.equal(summary.total, 3);
    assert.equal(summary.counts.permissive, 1);
    assert.equal(summary.counts.copyleft, 1);
    assert.equal(summary.counts.none, 1);
  });

  it('sorts licenses by frequency', () => {
    const sbom = { components: [
      { name: 'a', license: 'MIT' },
      { name: 'b', license: 'MIT' },
      { name: 'c', license: 'Apache-2.0' }
    ]};
    const summary = summarizeLicenses(sbom);
    assert.equal(summary.licenses[0].id, 'MIT');
    assert.equal(summary.licenses[0].count, 2);
  });

  it('handles compound expressions', () => {
    const sbom = { components: [
      { name: 'a', license: 'MIT OR Apache-2.0' }
    ]};
    const summary = summarizeLicenses(sbom);
    assert.equal(summary.licenses.length, 2);
  });

  it('handles empty SBOM', () => {
    const sbom = { components: [] };
    const summary = summarizeLicenses(sbom);
    assert.equal(summary.total, 0);
  });
});
