const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/license-expression');

describe('license-expression check', () => {
  it('passes known SPDX identifiers', () => {
    const sbom = { components: [{ name: 'a', license: 'MIT' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes compound expressions', () => {
    const sbom = { components: [{ name: 'a', license: 'MIT OR Apache-2.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes LicenseRef- custom ids', () => {
    const sbom = { components: [{ name: 'a', license: 'LicenseRef-Custom' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports unknown license identifiers', () => {
    const sbom = { components: [{ name: 'a', license: 'FooBarLicense' }] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });

  it('skips components without license', () => {
    const sbom = { components: [{ name: 'a', license: null }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
