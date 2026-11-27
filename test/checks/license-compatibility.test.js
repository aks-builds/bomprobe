const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/license-compatibility');

describe('license-compatibility check', () => {
  it('passes all-permissive components', () => {
    const sbom = { components: [
      { name: 'a', license: 'MIT' },
      { name: 'b', license: 'Apache-2.0' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('warns on mixed copyleft and permissive', () => {
    const sbom = { components: [
      { name: 'a', license: 'MIT' },
      { name: 'b', license: 'GPL-3.0-only' }
    ]};
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.severity === 'warning'));
  });

  it('errors on multiple copyleft families', () => {
    const sbom = { components: [
      { name: 'a', license: 'GPL-3.0-only' },
      { name: 'b', license: 'MPL-2.0' }
    ]};
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.severity === 'error'));
  });

  it('allows same copyleft family', () => {
    const sbom = { components: [
      { name: 'a', license: 'GPL-2.0-only' },
      { name: 'b', license: 'GPL-3.0-or-later' }
    ]};
    const findings = check.run(sbom);
    assert.ok(!findings.some(f => f.severity === 'error'));
  });

  it('skips components without license', () => {
    const sbom = { components: [{ name: 'a', license: null }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
