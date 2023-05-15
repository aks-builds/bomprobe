const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { cycloneDxToSpdx, convertCreationInfo, convertComponents, convertDependencies, mapHashToSpdx } = require('../../src/convert/cdxToSpdx');

describe('cycloneDxToSpdx', () => {
  it('returns null for invalid input', () => {
    assert.equal(cycloneDxToSpdx(null), null);
  });

  it('converts basic CycloneDX document', () => {
    const cdx = {
      bomFormat: 'CycloneDX',
      specVersion: '1.5',
      metadata: { component: { name: 'my-app' }, timestamp: '2023-01-01T00:00:00Z' },
      components: [
        { name: 'lodash', version: '4.17.21', 'bom-ref': 'lodash', licenses: [{ license: { id: 'MIT' } }] }
      ]
    };
    const spdx = cycloneDxToSpdx(cdx);
    assert.equal(spdx.spdxVersion, 'SPDX-2.3');
    assert.equal(spdx.name, 'my-app');
    assert.equal(spdx.packages.length, 1);
    assert.equal(spdx.packages[0].name, 'lodash');
  });
});

describe('convertCreationInfo', () => {
  it('extracts tools', () => {
    const info = convertCreationInfo({
      metadata: { tools: [{ name: 'syft', version: '0.80.0' }] }
    });
    assert.ok(info.creators.includes('Tool:syft-0.80.0'));
  });

  it('extracts authors', () => {
    const info = convertCreationInfo({
      metadata: { authors: [{ name: 'John' }] }
    });
    assert.ok(info.creators.includes('Person: John'));
  });
});

describe('convertComponents', () => {
  it('maps purl to externalRefs', () => {
    const pkgs = convertComponents({
      components: [{ name: 'express', version: '4.18.2', purl: 'pkg:npm/express@4.18.2' }]
    });
    assert.ok(pkgs[0].externalRefs);
    assert.equal(pkgs[0].externalRefs[0].referenceType, 'purl');
  });

  it('maps hashes to checksums', () => {
    const pkgs = convertComponents({
      components: [{ name: 'lib', hashes: [{ alg: 'SHA-256', content: 'abc123' }] }]
    });
    assert.equal(pkgs[0].checksums[0].algorithm, 'SHA256');
  });

  it('maps supplier', () => {
    const pkgs = convertComponents({
      components: [{ name: 'lib', supplier: { name: 'Acme Corp' } }]
    });
    assert.equal(pkgs[0].supplier, 'Organization: Acme Corp');
  });

  it('maps license expressions', () => {
    const pkgs = convertComponents({
      components: [{ name: 'lib', licenses: [{ expression: 'MIT OR Apache-2.0' }] }]
    });
    assert.equal(pkgs[0].licenseConcluded, 'MIT OR Apache-2.0');
  });

  it('maps type to primaryPackagePurpose', () => {
    const pkgs = convertComponents({
      components: [{ name: 'lib', type: 'framework' }]
    });
    assert.equal(pkgs[0].primaryPackagePurpose, 'FRAMEWORK');
  });
});

describe('convertDependencies', () => {
  it('maps to DEPENDS_ON relationships', () => {
    const rels = convertDependencies({
      dependencies: [{ ref: 'a', dependsOn: ['b', 'c'] }]
    });
    assert.equal(rels.length, 2);
    assert.equal(rels[0].relationshipType, 'DEPENDS_ON');
  });
});

describe('mapHashToSpdx', () => {
  it('maps CycloneDX hash names to SPDX', () => {
    assert.equal(mapHashToSpdx('SHA-256'), 'SHA256');
    assert.equal(mapHashToSpdx('SHA-1'), 'SHA1');
    assert.equal(mapHashToSpdx('MD5'), 'MD5');
  });
});
