const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/componentExternalRefQuality');

describe('component-external-ref-quality', () => {
  it('flags HTTP external references', () => {
    const sbom = {
      components: [{
        name: 'lib',
        externalReferences: [{ type: 'website', url: 'http://example.com' }]
      }]
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('HTTP'));
  });

  it('passes HTTPS references', () => {
    const sbom = {
      components: [{
        name: 'lib',
        externalReferences: [{ type: 'website', url: 'https://example.com' }]
      }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags references without type', () => {
    const sbom = {
      components: [{
        name: 'lib',
        externalReferences: [{ url: 'https://example.com' }]
      }]
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('type'));
  });

  it('skips components without external references', () => {
    assert.equal(check.run({ components: [{ name: 'x' }] }).length, 0);
  });
});
