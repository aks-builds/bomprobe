const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-build-env');

describe('component-build-env check', () => {
  it('passes with build-system property', () => {
    const sbom = { components: [{ name: 'a', type: 'library', properties: [{ name: 'build-system', value: 'maven' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with evidence occurrences', () => {
    const sbom = { components: [{ name: 'a', type: 'library', evidence: { occurrences: [{ location: '/app' }] } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component without build info', () => {
    const sbom = { components: [{ name: 'bare-lib', type: 'library' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips data components', () => {
    const sbom = { components: [{ name: 'config', type: 'data' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('skips file components', () => {
    const sbom = { components: [{ name: 'readme', type: 'file' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
