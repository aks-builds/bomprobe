const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/componentLicenseNotice');

describe('component-license-notice', () => {
  it('passes standard license without text', () => {
    const sbom = { components: [{ name: 'a', licenses: [{ license: { id: 'MIT' } }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('notes non-standard license without text', () => {
    const sbom = { components: [{ name: 'a', licenses: [{ license: { id: 'ACME-Internal-1.0' } }] }] };
    assert.ok(check.run(sbom).length > 0);
  });

  it('passes non-standard license with text', () => {
    const sbom = { components: [{ name: 'a', licenses: [{ license: { id: 'Custom', text: { content: '...' } } }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('skips unlicensed components', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });
});
