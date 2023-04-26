const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-update-url');

describe('component-update-url check', () => {
  it('passes with advisories ref', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'advisories', url: 'https://x' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with issue-tracker', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'issue-tracker', url: 'https://x' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with website', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'website', url: 'https://x' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component with no tracking refs', () => {
    const sbom = { components: [{ name: 'bare' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips data type', () => {
    assert.equal(check.run({ components: [{ name: 'x', type: 'file' }] }).length, 0);
  });
});
