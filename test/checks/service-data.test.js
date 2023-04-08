const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/service-data');

describe('service-data check', () => {
  it('skips non-service components', () => {
    const sbom = { components: [{ name: 'a', type: 'library' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes service with endpoint', () => {
    const sbom = { components: [{ name: 'api', type: 'service', externalReferences: [{ type: 'website', url: 'https://api.example.com' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags service without endpoint', () => {
    const sbom = { components: [{ name: 'api', type: 'service' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('checks platform type too', () => {
    const sbom = { components: [{ name: 'cloud', type: 'platform' }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
