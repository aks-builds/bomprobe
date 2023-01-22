const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-name');

describe('component-name check', () => {
  it('passes when all components have names', () => {
    const sbom = { components: [{ name: 'express' }, { name: 'lodash' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports components without names', () => {
    const sbom = { components: [{ name: null }, { name: 'lodash' }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'error');
  });

  it('handles empty component list', () => {
    const sbom = { components: [] };
    assert.equal(check.run(sbom).length, 0);
  });
});
