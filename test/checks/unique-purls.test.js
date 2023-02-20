const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/unique-purls');

describe('unique-purls check', () => {
  it('passes when all purls are unique', () => {
    const sbom = {
      components: [
        { name: 'a', purl: 'pkg:npm/a@1.0' },
        { name: 'b', purl: 'pkg:npm/b@2.0' }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports duplicate purls', () => {
    const sbom = {
      components: [
        { name: 'a', purl: 'pkg:npm/a@1.0' },
        { name: 'a-copy', purl: 'pkg:npm/a@1.0' }
      ]
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
    assert.ok(findings[0].message.includes('Duplicate'));
  });

  it('skips components without purls', () => {
    const sbom = {
      components: [
        { name: 'a', purl: null },
        { name: 'b', purl: null }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });
});
