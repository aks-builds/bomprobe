const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-release-notes');

describe('component-release-notes check', () => {
  it('skips components with no refs', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with release-notes ref', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'release-notes', url: 'x' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags refs without release notes', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'vcs', url: 'x' }] }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
