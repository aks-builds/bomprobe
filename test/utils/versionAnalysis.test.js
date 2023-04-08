const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseVersion, isPrerelease, isMajorZero, analyzeVersions } = require('../../src/utils/versionAnalysis');

describe('version analysis', () => {
  it('parses semver string', () => {
    const v = parseVersion('1.2.3');
    assert.equal(v.major, 1);
    assert.equal(v.minor, 2);
    assert.equal(v.patch, 3);
  });

  it('parses v-prefixed version', () => {
    const v = parseVersion('v2.0.0');
    assert.equal(v.major, 2);
  });

  it('detects prerelease', () => {
    assert.ok(isPrerelease('1.0.0-beta.1'));
    assert.ok(isPrerelease('2.0.0-rc1'));
    assert.ok(!isPrerelease('1.0.0'));
  });

  it('detects major zero', () => {
    assert.ok(isMajorZero('0.1.0'));
    assert.ok(!isMajorZero('1.0.0'));
  });

  it('returns null for invalid version', () => {
    assert.equal(parseVersion(null), null);
    assert.equal(parseVersion('latest'), null);
  });

  it('analyzes component versions', () => {
    const components = [
      { name: 'a', version: '1.0.0' },
      { name: 'b', version: '0.2.0' },
      { name: 'c', version: '1.0.0-beta' },
      { name: 'd', version: null }
    ];
    const result = analyzeVersions(components);
    assert.equal(result.total, 4);
    assert.equal(result.withVersion, 3);
    assert.equal(result.prerelease, 1);
    assert.equal(result.majorZero, 1);
    assert.equal(result.noVersion, 1);
  });
});
