const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-license');

describe('component-license check', () => {
  it('passes when all components have licenses', () => {
    const sbom = { components: [{ name: 'a', license: 'MIT' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports components missing licenses', () => {
    const sbom = { components: [{ name: 'a', license: null }, { name: 'b', license: 'MIT' }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
  });

  it('reports all unlicensed components', () => {
    const sbom = { components: [{ name: 'a', license: null }, { name: 'b', license: null }] };
    assert.equal(check.run(sbom).length, 2);
  });
});
