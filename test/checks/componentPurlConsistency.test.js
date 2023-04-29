const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/componentPurlConsistency');

describe('component-purl-consistency', () => {
  it('passes consistent purl', () => {
    const sbom = {
      components: [{ name: 'lodash', version: '4.17.21', purl: 'pkg:npm/lodash@4.17.21' }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('warns when purl name does not match component name', () => {
    const sbom = {
      components: [{ name: 'my-lib', version: '1.0', purl: 'pkg:npm/different-lib@1.0' }]
    };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.severity === 'warning'));
  });

  it('notes when purl is missing version', () => {
    const sbom = {
      components: [{ name: 'lodash', version: '4.17.21', purl: 'pkg:npm/lodash' }]
    };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.severity === 'info'));
  });

  it('skips components without purl', () => {
    const sbom = { components: [{ name: 'no-purl' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
