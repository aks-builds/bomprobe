const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { checkCompliance, checkAllProfiles, listProfiles } = require('../../src/compliance/index');

describe('compliance index', () => {
  const sbom = {
    metadata: { timestamp: 'now', authors: [{ name: 'a' }], tools: [{ name: 't' }] },
    components: [{ name: 'a', version: '1', purl: 'p', supplier: { name: 's' }, licenses: [{}], hashes: [{}] }],
    dependencies: [{ ref: 'a', dependsOn: [] }]
  };

  it('runs NTIA by name', () => {
    const result = checkCompliance(sbom, 'ntia');
    assert.equal(result.profile, 'NTIA Minimum Elements');
  });

  it('runs EU CRA by alias', () => {
    const result = checkCompliance(sbom, 'eu-cra');
    assert.equal(result.profile, 'EU Cyber Resilience Act');
  });

  it('runs BSI TR by name', () => {
    const result = checkCompliance(sbom, 'bsitr');
    assert.equal(result.profile, 'BSI TR-03183');
  });

  it('returns error for unknown profile', () => {
    const result = checkCompliance(sbom, 'invalid');
    assert.ok(result.error);
  });

  it('runs all profiles', () => {
    const results = checkAllProfiles(sbom);
    assert.equal(results.length, 3);
  });

  it('lists available profiles', () => {
    const profiles = listProfiles();
    assert.equal(profiles.length, 3);
    assert.ok(profiles.some(p => p.id === 'ntia'));
  });
});
