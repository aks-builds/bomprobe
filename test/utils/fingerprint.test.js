const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { fingerprintComponent, fingerprintSbom, findDuplicateFingerprints } = require('../../src/utils/fingerprint');

describe('fingerprint utilities', () => {
  it('generates consistent component fingerprint', () => {
    const c = { name: 'lodash', version: '4.17.21', purl: 'pkg:npm/lodash@4.17.21' };
    const fp1 = fingerprintComponent(c);
    const fp2 = fingerprintComponent(c);
    assert.equal(fp1, fp2);
    assert.equal(fp1.length, 16);
  });

  it('generates different fingerprints for different components', () => {
    const a = { name: 'a', version: '1.0' };
    const b = { name: 'b', version: '1.0' };
    assert.notEqual(fingerprintComponent(a), fingerprintComponent(b));
  });

  it('generates SBOM fingerprint', () => {
    const sbom = { components: [{ name: 'a', version: '1.0' }, { name: 'b', version: '2.0' }] };
    const fp = fingerprintSbom(sbom);
    assert.equal(fp.length, 32);
  });

  it('SBOM fingerprint is order independent', () => {
    const sbom1 = { components: [{ name: 'a', version: '1.0' }, { name: 'b', version: '2.0' }] };
    const sbom2 = { components: [{ name: 'b', version: '2.0' }, { name: 'a', version: '1.0' }] };
    assert.equal(fingerprintSbom(sbom1), fingerprintSbom(sbom2));
  });

  it('finds duplicate fingerprints', () => {
    const components = [
      { name: 'a', version: '1.0' },
      { name: 'a', version: '1.0' }
    ];
    const dups = findDuplicateFingerprints(components);
    assert.equal(dups.length, 1);
  });

  it('no duplicates in unique list', () => {
    const components = [
      { name: 'a', version: '1.0' },
      { name: 'b', version: '2.0' }
    ];
    assert.equal(findDuplicateFingerprints(components).length, 0);
  });
});
