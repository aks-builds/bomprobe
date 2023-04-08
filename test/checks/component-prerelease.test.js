const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-prerelease');

describe('component-prerelease check', () => {
  it('passes stable versions', () => {
    const sbom = { components: [{ name: 'a', version: '1.0.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('warns on prerelease version', () => {
    const sbom = { components: [{ name: 'a', version: '2.0.0-beta.1' }] };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.severity === 'warning'));
  });

  it('reports major zero as info', () => {
    const sbom = { components: [{ name: 'a', version: '0.3.0' }] };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.severity === 'info'));
  });

  it('skips components without version', () => {
    const sbom = { components: [{ name: 'a', version: null }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports both prerelease and major zero', () => {
    const sbom = { components: [{ name: 'a', version: '0.1.0-alpha' }] };
    assert.equal(check.run(sbom).length, 2);
  });
});
