const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { normalize } = require('../../src/parsers/spdx');
const { runAll } = require('../../src/checks');

describe('SPDX audit integration', () => {
  const spdxDoc = {
    spdxVersion: 'SPDX-2.3',
    dataLicense: 'CC0-1.0',
    name: 'test-document',
    documentNamespace: 'https://example.com/test',
    creationInfo: {
      created: new Date().toISOString(),
      creators: ['Tool: bomprobe-1.0', 'Organization: Acme']
    },
    packages: [
      {
        SPDXID: 'SPDXRef-Package',
        name: 'my-lib',
        versionInfo: '2.0.0',
        supplier: 'Organization: Acme Corp',
        licenseDeclared: 'MIT',
        copyrightText: 'Copyright 2023 Acme',
        checksums: [{ algorithm: 'SHA256', checksumValue: 'abc123' }],
        externalRefs: [{ referenceType: 'purl', referenceLocator: 'pkg:npm/my-lib@2.0.0', referenceCategory: 'PACKAGE-MANAGER' }]
      }
    ],
    relationships: [
      { spdxElementId: 'SPDXRef-DOCUMENT', relatedSpdxElement: 'SPDXRef-Package', relationshipType: 'DESCRIBES' }
    ]
  };

  it('normalizes SPDX document', () => {
    const normalized = normalize(spdxDoc);
    assert.equal(normalized.format, 'spdx');
    assert.ok(normalized.components.length > 0);
  });

  it('runs checks on normalized SPDX', () => {
    const normalized = normalize(spdxDoc);
    const results = runAll(normalized);
    assert.ok(results.length > 40);
  });

  it('every check returns findings array on SPDX', () => {
    const normalized = normalize(spdxDoc);
    const results = runAll(normalized);
    for (const r of results) {
      assert.ok(Array.isArray(r.findings), `${r.id} should return array`);
    }
  });
});
