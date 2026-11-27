const { describe, it, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { detectFormat } = require('../../src/parsers/detect');

const fixtures = path.join(__dirname, '..', 'fixtures');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bomprobe-detect-test-'));

after(() => {
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
});

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
    assert.equal(result.error, 'Valid JSON file does not contain a recognized SBOM format');
  });

  it('returns clear error for empty file', () => {
    const emptyFile = path.join(tmpDir, 'empty.json');
    fs.writeFileSync(emptyFile, '');
    const result = detectFormat(emptyFile);
    assert.ok(result.error);
    assert.equal(result.error, 'Input file is empty: contains no data');
  });

  it('returns clear error for whitespace-only file', () => {
    const wsFile = path.join(tmpDir, 'whitespace.json');
    fs.writeFileSync(wsFile, '   \r\n\t  ');
    const result = detectFormat(wsFile);
    assert.ok(result.error);
    assert.equal(result.error, 'Input file is empty: contains no data');
  });

  it('returns clear error for valid JSON that is not an SBOM', () => {
    const nonSbomFile = path.join(tmpDir, 'non-sbom.json');
    fs.writeFileSync(nonSbomFile, JSON.stringify({ name: 'my-project', version: '1.0.0' }));
    const result = detectFormat(nonSbomFile);
    assert.ok(result.error);
    assert.equal(result.error, 'Valid JSON file does not contain a recognized SBOM format');
  });

  it('returns clear error for JSON array or null that is not an SBOM', () => {
    const nullFile = path.join(tmpDir, 'null.json');
    fs.writeFileSync(nullFile, 'null');
    const resultNull = detectFormat(nullFile);
    assert.ok(resultNull.error);
    assert.equal(resultNull.error, 'Valid JSON file does not contain a recognized SBOM format');

    const arrFile = path.join(tmpDir, 'arr.json');
    fs.writeFileSync(arrFile, '[]');
    const resultArr = detectFormat(arrFile);
    assert.ok(resultArr.error);
    assert.equal(resultArr.error, 'Valid JSON file does not contain a recognized SBOM format');
  });

  it('returns clear error informing SPDX XML format is not supported', () => {
    const spdxXmlFile = path.join(tmpDir, 'spdx.xml');
    fs.writeFileSync(
      spdxXmlFile,
      '<?xml version="1.0" encoding="UTF-8"?>\n<spdx:SpdxDocument xmlns:spdx="http://spdx.org/rdf/terms#"></spdx:SpdxDocument>'
    );
    const result = detectFormat(spdxXmlFile);
    assert.ok(result.error);
    assert.equal(result.error, 'SPDX XML format is not currently supported');
  });

  it('returns clear error for incomplete or truncated JSON', () => {
    const truncFile = path.join(tmpDir, 'truncated.json');
    fs.writeFileSync(truncFile, '{"bomFormat": "CycloneDX", "specVersion": "1.5"');
    const result = detectFormat(truncFile);
    assert.ok(result.error);
    assert.equal(result.error, 'JSON file is incomplete or incorrectly formatted');
  });

  it('returns clear error for malformed JSON syntax', () => {
    const malformedFile = path.join(tmpDir, 'malformed.json');
    fs.writeFileSync(malformedFile, '{"bomFormat": "CycloneDX", "specVersion": }');
    const result = detectFormat(malformedFile);
    assert.ok(result.error);
    assert.equal(result.error, 'JSON file is incomplete or incorrectly formatted');
  });
});
