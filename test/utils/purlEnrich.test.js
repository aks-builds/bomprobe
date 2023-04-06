const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { enrichPurl, enrichComponents } = require('../../src/utils/purlEnrich');

describe('PURL enrichment', () => {
  it('enriches npm PURL with registry URL', () => {
    const result = enrichPurl('pkg:npm/express@4.18.0');
    assert.ok(result.registryUrl.includes('npmjs.com'));
    assert.equal(result.qualifiedName, 'express');
  });

  it('enriches maven PURL with namespace', () => {
    const result = enrichPurl('pkg:maven/org.apache/commons@1.0');
    assert.ok(result.registryUrl.includes('mvnrepository'));
    assert.equal(result.qualifiedName, 'org.apache/commons');
  });

  it('enriches pypi PURL', () => {
    const result = enrichPurl('pkg:pypi/requests@2.28.0');
    assert.ok(result.registryUrl.includes('pypi.org'));
  });

  it('returns null for invalid PURL', () => {
    assert.equal(enrichPurl('not-a-purl'), null);
  });

  it('handles unknown PURL type', () => {
    const result = enrichPurl('pkg:unknown/lib@1.0');
    assert.equal(result.registryUrl, null);
  });

  it('enriches component list', () => {
    const components = [
      { name: 'a', purl: 'pkg:npm/a@1.0' },
      { name: 'b', purl: null }
    ];
    const enriched = enrichComponents(components);
    assert.ok(enriched[0].enriched);
    assert.equal(enriched[1].enriched, null);
  });
});
