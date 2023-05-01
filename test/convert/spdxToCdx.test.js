const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { spdxToCycloneDx, convertMetadata, convertPackages, convertRelationships, mapHashAlgorithm } = require('../../src/convert/spdxToCdx');

describe('spdxToCycloneDx', () => {
  it('returns null for invalid input', () => {
    assert.equal(spdxToCycloneDx(null), null);
  });

  it('converts basic SPDX document', () => {
    const spdx = {
      spdxVersion: 'SPDX-2.3',
      name: 'my-app',
      creationInfo: { created: '2023-01-01T00:00:00Z', creators: ['Tool:bomgen-1.0'] },
      packages: [
        { SPDXID: 'SPDXRef-Package-lodash', name: 'lodash', versionInfo: '4.17.21', licenseConcluded: 'MIT' }
      ]
    };
    const cdx = spdxToCycloneDx(spdx);
    assert.equal(cdx.bomFormat, 'CycloneDX');
    assert.equal(cdx.specVersion, '1.5');
    assert.equal(cdx.components.length, 1);
    assert.equal(cdx.components[0].name, 'lodash');
  });

  it('skips DOCUMENT package', () => {
    const spdx = {
      packages: [
        { SPDXID: 'SPDXRef-DOCUMENT', name: 'doc' },
        { SPDXID: 'SPDXRef-pkg', name: 'real' }
      ]
    };
    const cdx = spdxToCycloneDx(spdx);
    assert.equal(cdx.components.length, 1);
    assert.equal(cdx.components[0].name, 'real');
  });
});

describe('convertMetadata', () => {
  it('extracts tools from creators', () => {
    const meta = convertMetadata({ creationInfo: { creators: ['Tool:syft-0.80.0'] } });
    assert.ok(meta.tools);
    assert.equal(meta.tools[0].name, 'syft-0.80.0');
  });

  it('sets root component from name', () => {
    const meta = convertMetadata({ name: 'my-project' });
    assert.equal(meta.component.name, 'my-project');
  });
});

describe('convertPackages', () => {
  it('maps purl from externalRefs', () => {
    const pkgs = convertPackages({
      packages: [{
        SPDXID: 'SPDXRef-p',
        name: 'express',
        versionInfo: '4.18.2',
        externalRefs: [{ referenceType: 'purl', referenceLocator: 'pkg:npm/express@4.18.2' }]
      }]
    });
    assert.equal(pkgs[0].purl, 'pkg:npm/express@4.18.2');
  });

  it('maps checksums to hashes', () => {
    const pkgs = convertPackages({
      packages: [{
        SPDXID: 'SPDXRef-p',
        name: 'lib',
        checksums: [{ algorithm: 'SHA256', checksumValue: 'abc123' }]
      }]
    });
    assert.equal(pkgs[0].hashes[0].alg, 'SHA-256');
  });

  it('extracts supplier', () => {
    const pkgs = convertPackages({
      packages: [{
        SPDXID: 'SPDXRef-p',
        name: 'lib',
        supplier: 'Organization: Acme Corp'
      }]
    });
    assert.equal(pkgs[0].supplier.name, 'Acme Corp');
  });

  it('handles license expressions', () => {
    const pkgs = convertPackages({
      packages: [{
        SPDXID: 'SPDXRef-p',
        name: 'lib',
        licenseConcluded: 'MIT OR Apache-2.0'
      }]
    });
    assert.ok(pkgs[0].licenses[0].expression);
  });
});

describe('convertRelationships', () => {
  it('maps DEPENDS_ON to dependencies', () => {
    const deps = convertRelationships({
      relationships: [
        { spdxElementId: 'SPDXRef-A', relatedSpdxElement: 'SPDXRef-B', relationshipType: 'DEPENDS_ON' },
        { spdxElementId: 'SPDXRef-A', relatedSpdxElement: 'SPDXRef-C', relationshipType: 'DEPENDS_ON' },
        { spdxElementId: 'SPDXRef-B', relatedSpdxElement: 'SPDXRef-C', relationshipType: 'DESCRIBED_BY' }
      ]
    });
    assert.equal(deps.length, 1);
    assert.equal(deps[0].ref, 'SPDXRef-A');
    assert.equal(deps[0].dependsOn.length, 2);
  });
});

describe('mapHashAlgorithm', () => {
  it('maps SPDX hash names to CycloneDX', () => {
    assert.equal(mapHashAlgorithm('SHA256'), 'SHA-256');
    assert.equal(mapHashAlgorithm('SHA1'), 'SHA-1');
    assert.equal(mapHashAlgorithm('MD5'), 'MD5');
  });
});
