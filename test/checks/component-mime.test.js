const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-mime');

describe('component-mime check', () => {
  it('skips library type', () => {
    const sbom = { components: [{ name: 'a', type: 'library' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags firmware without MIME', () => {
    const sbom = { components: [{ name: 'fw', type: 'firmware' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('passes firmware with MIME', () => {
    const sbom = { components: [{ name: 'fw', type: 'firmware', mime: 'application/octet-stream' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags container without MIME', () => {
    const sbom = { components: [{ name: 'img', type: 'container' }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
