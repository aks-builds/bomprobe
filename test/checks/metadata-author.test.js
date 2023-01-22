const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-author');

describe('metadata-author check', () => {
  it('passes when author is present', () => {
    const sbom = { metadata: { author: 'acme' }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports when author is missing', () => {
    const sbom = { metadata: { author: null }, components: [] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.match(findings[0].message, /no author/);
  });
});
