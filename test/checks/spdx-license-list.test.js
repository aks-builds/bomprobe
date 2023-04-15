const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-license-list');

describe('spdx-license-list check', () => {
  it('passes with common SPDX ID', () => {
    const sbom = { components: [{ name: 'a', licenses: [{ license: { id: 'MIT' } }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with Apache-2.0', () => {
    const sbom = { components: [{ name: 'a', licenses: [{ license: { id: 'Apache-2.0' } }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags uncommon identifier', () => {
    const sbom = { components: [{ name: 'a', licenses: [{ license: { id: 'Custom-License-1.0' } }] }] };
    assert.equal(check.run(sbom).length, 1);
    assert.equal(check.run(sbom)[0].severity, 'info');
  });

  it('allows SPDX expressions with OR', () => {
    const sbom = { components: [{ name: 'a', licenses: [{ license: { id: 'MIT OR Apache-2.0' } }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('skips components without licenses', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
