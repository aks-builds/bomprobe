const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-classifier');

describe('component-classifier check', () => {
  it('passes known type', () => {
    const sbom = { components: [{ name: 'a', type: 'library' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags unknown type', () => {
    const sbom = { components: [{ name: 'a', type: 'widget' }] };
    assert.equal(check.run(sbom).length, 1);
    assert.equal(check.run(sbom)[0].severity, 'warning');
  });

  it('flags missing type', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 1);
    assert.equal(check.run(sbom)[0].severity, 'info');
  });

  it('accepts machine-learning-model type', () => {
    const sbom = { components: [{ name: 'model', type: 'machine-learning-model' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('accepts cryptographic-asset type', () => {
    const sbom = { components: [{ name: 'cert', type: 'cryptographic-asset' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
