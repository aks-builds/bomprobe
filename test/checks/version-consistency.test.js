const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/version-consistency');

describe('version-consistency check', () => {
  it('passes when all versions are semver', () => {
    const sbom = {
      components: [
        { name: 'a', version: '1.0.0' },
        { name: 'b', version: '2.3.4' }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes when all versions are non-semver', () => {
    const sbom = {
      components: [
        { name: 'a', version: 'latest' },
        { name: 'b', version: 'nightly' }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports mixed version formats', () => {
    const sbom = {
      components: [
        { name: 'a', version: '1.0.0' },
        { name: 'b', version: '2.3.4' },
        { name: 'c', version: 'latest' }
      ]
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].component, 'c');
  });

  it('skips components without version', () => {
    const sbom = {
      components: [
        { name: 'a', version: '1.0.0' },
        { name: 'b', version: null }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });
});
