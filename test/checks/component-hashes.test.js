const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-hashes');

describe('component-hashes check', () => {
  it('passes when components have hashes', () => {
    const sbom = { components: [{ name: 'a', hashes: 2 }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports components with zero hashes', () => {
    const sbom = { components: [{ name: 'a', hashes: 0 }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });
});
