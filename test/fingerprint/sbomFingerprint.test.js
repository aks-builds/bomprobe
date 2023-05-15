const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { fingerprintSbom, fingerprintComponent, compareSbomFingerprints, formatFingerprint } = require('../../src/fingerprint/sbomFingerprint');

describe('fingerprintSbom', () => {
  it('returns null hash for empty input', () => {
    const fp = fingerprintSbom(null);
    assert.equal(fp.hash, null);
  });

  it('produces consistent hash', () => {
    const sbom = { components: [{ name: 'a', version: '1.0' }, { name: 'b', version: '2.0' }] };
    const fp1 = fingerprintSbom(sbom);
    const fp2 = fingerprintSbom(sbom);
    assert.equal(fp1.hash, fp2.hash);
  });

  it('produces different hash for different components', () => {
    const sbom1 = { components: [{ name: 'a', version: '1.0' }] };
    const sbom2 = { components: [{ name: 'b', version: '1.0' }] };
    assert.notEqual(fingerprintSbom(sbom1).hash, fingerprintSbom(sbom2).hash);
  });

  it('is order-independent', () => {
    const sbom1 = { components: [{ name: 'a', version: '1' }, { name: 'b', version: '2' }] };
    const sbom2 = { components: [{ name: 'b', version: '2' }, { name: 'a', version: '1' }] };
    assert.equal(fingerprintSbom(sbom1).hash, fingerprintSbom(sbom2).hash);
  });

  it('includes signature prefix', () => {
    const fp = fingerprintSbom({ components: [{ name: 'x' }] });
    assert.equal(fp.signature.length, 12);
    assert.ok(fp.hash.startsWith(fp.signature));
  });
});

describe('fingerprintComponent', () => {
  it('returns 16-char hex', () => {
    const fp = fingerprintComponent({ name: 'express', version: '4.18.2' });
    assert.equal(fp.length, 16);
  });

  it('returns null for invalid input', () => {
    assert.equal(fingerprintComponent(null), null);
  });
});

describe('compareSbomFingerprints', () => {
  it('detects identical SBOMs', () => {
    const fp = fingerprintSbom({ components: [{ name: 'a' }] });
    const result = compareSbomFingerprints(fp, fp);
    assert.equal(result.match, true);
  });

  it('detects different SBOMs', () => {
    const fp1 = fingerprintSbom({ components: [{ name: 'a' }] });
    const fp2 = fingerprintSbom({ components: [{ name: 'b' }] });
    const result = compareSbomFingerprints(fp1, fp2);
    assert.equal(result.match, false);
  });

  it('reports different component count', () => {
    const fp1 = fingerprintSbom({ components: [{ name: 'a' }] });
    const fp2 = fingerprintSbom({ components: [{ name: 'a' }, { name: 'b' }] });
    const result = compareSbomFingerprints(fp1, fp2);
    assert.ok(result.reason.includes('different component count'));
  });
});

describe('formatFingerprint', () => {
  it('formats readable output', () => {
    const fp = fingerprintSbom({ components: [{ name: 'test' }] });
    const out = formatFingerprint(fp);
    assert.ok(out.includes('Fingerprint'));
    assert.ok(out.includes(fp.signature));
  });
});
