const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseVersionParts, compareVersions, isMajorBump, sortVersions } = require('../../src/utils/versionRange');

describe('version range utils', () => {
  describe('parseVersionParts', () => {
    it('parses semver', () => {
      const p = parseVersionParts('1.2.3');
      assert.deepEqual({ major: p.major, minor: p.minor, patch: p.patch }, { major: 1, minor: 2, patch: 3 });
    });

    it('handles v prefix', () => {
      const p = parseVersionParts('v2.0.0');
      assert.equal(p.major, 2);
    });

    it('handles prerelease', () => {
      const p = parseVersionParts('1.0.0-beta.1');
      assert.equal(p.prerelease, 'beta.1');
    });

    it('handles build metadata', () => {
      const p = parseVersionParts('1.0.0+build.123');
      assert.equal(p.build, 'build.123');
    });

    it('returns null for garbage', () => {
      assert.equal(parseVersionParts('not-a-version'), null);
      assert.equal(parseVersionParts(null), null);
    });
  });

  describe('compareVersions', () => {
    it('sorts by major', () => {
      assert.ok(compareVersions('2.0.0', '1.0.0') > 0);
    });

    it('sorts by minor', () => {
      assert.ok(compareVersions('1.2.0', '1.1.0') > 0);
    });

    it('sorts by patch', () => {
      assert.ok(compareVersions('1.0.2', '1.0.1') > 0);
    });

    it('prerelease sorts before release', () => {
      assert.ok(compareVersions('1.0.0-alpha', '1.0.0') < 0);
    });
  });

  describe('isMajorBump', () => {
    it('detects major bump', () => {
      assert.equal(isMajorBump('1.2.3', '2.0.0'), true);
    });

    it('rejects minor bump', () => {
      assert.equal(isMajorBump('1.2.3', '1.3.0'), false);
    });
  });

  describe('sortVersions', () => {
    it('sorts ascending', () => {
      const sorted = sortVersions(['2.0.0', '1.0.0', '1.5.0', '0.9.0']);
      assert.deepEqual(sorted, ['0.9.0', '1.0.0', '1.5.0', '2.0.0']);
    });
  });
});
