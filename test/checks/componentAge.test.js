const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/componentAge');

describe('component-age', () => {
  it('flags components with old release dates', () => {
    const sbom = {
      components: [
        { name: 'ancient-lib', releaseDate: '2018-01-01T00:00:00Z' }
      ]
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('ancient-lib'));
  });

  it('passes components with recent dates', () => {
    const sbom = {
      components: [
        { name: 'fresh-lib', releaseDate: new Date().toISOString() }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('skips components without release date', () => {
    const sbom = { components: [{ name: 'no-date' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles invalid dates', () => {
    const sbom = { components: [{ name: 'bad', releaseDate: 'not-a-date' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
