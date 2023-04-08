const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { detectFormat, isMinimumVersion } = require('../../src/utils/specDetect');

describe('spec detection', () => {
  it('detects CycloneDX', () => {
    const result = detectFormat({ bomFormat: 'CycloneDX', specVersion: '1.5' });
    assert.equal(result.format, 'cyclonedx');
    assert.equal(result.version, '1.5');
  });

  it('detects SPDX', () => {
    const result = detectFormat({ spdxVersion: 'SPDX-2.3' });
    assert.equal(result.format, 'spdx');
    assert.equal(result.version, '2.3');
  });

  it('returns unknown for unrecognized', () => {
    assert.equal(detectFormat({}).format, 'unknown');
  });

  it('checks minimum version', () => {
    assert.ok(isMinimumVersion({ version: '1.5' }, '1.4'));
    assert.ok(isMinimumVersion({ version: '2.0' }, '1.5'));
    assert.ok(!isMinimumVersion({ version: '1.3' }, '1.4'));
  });
});
