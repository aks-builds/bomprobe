const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { detectFormat } = require('../../src/parsers/detect');

const fixtures = path.join(__dirname, '..', 'fixtures');

describe('detectFormat', () => {
  it('detects CycloneDX format', () => {
    const result = detectFormat(path.join(fixtures, 'minimal-cdx.json'));
    assert.equal(result.format, 'cyclonedx');
    assert.equal(result.version, '1.5');
    assert.ok(result.doc);
  });

  it('detects SPDX format', () => {
    const result = detectFormat(path.join(fixtures, 'minimal-spdx.json'));
    assert.equal(result.format, 'spdx');
    assert.equal(result.version, 'SPDX-2.3');
    assert.ok(result.doc);
  });

  it('returns error for invalid JSON', () => {
    const result = detectFormat(path.join(fixtures, '..', '..', 'package-lock.json'));
    assert.ok(result.error);
  });

  it('returns error for unknown format', () => {
    const result = detectFormat(path.join(fixtures, '..', '..', 'package.json'));
    assert.ok(result.error);
  });
});
