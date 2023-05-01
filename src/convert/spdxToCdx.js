function spdxToCycloneDx(spdx) {
  if (!spdx || typeof spdx !== 'object') return null;

  const cdx = {
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    version: 1,
    metadata: convertMetadata(spdx),
    components: convertPackages(spdx),
    dependencies: convertRelationships(spdx)
  };

  return cdx;
}

function convertMetadata(spdx) {
  const meta = { timestamp: spdx.creationInfo?.created || new Date().toISOString() };

  if (spdx.creationInfo?.creators) {
    meta.tools = [];
    for (const creator of spdx.creationInfo.creators) {
      if (typeof creator !== 'string') continue;
      if (creator.startsWith('Tool:')) {
        const name = creator.slice(5).trim();
        const parts = name.split('-');
        meta.tools.push({ vendor: parts[0], name, version: parts.length > 1 ? parts[parts.length - 1] : '' });
      }
    }
    if (meta.tools.length === 0) delete meta.tools;
  }

  if (spdx.name) meta.component = { type: 'application', name: spdx.name, version: spdx.documentNamespace ? '1.0' : '' };

  return meta;
}

function convertPackages(spdx) {
  const packages = Array.isArray(spdx.packages) ? spdx.packages : [];
  return packages
    .filter(pkg => pkg && pkg.SPDXID !== 'SPDXRef-DOCUMENT')
    .map(pkg => {
      const comp = {
        type: mapPackageType(pkg),
        name: pkg.name || 'unknown',
        version: pkg.versionInfo || '',
        'bom-ref': pkg.SPDXID || ''
      };

      if (pkg.downloadLocation && pkg.downloadLocation !== 'NOASSERTION') {
        comp.externalReferences = [{ type: 'distribution', url: pkg.downloadLocation }];
      }

      if (pkg.supplier && pkg.supplier !== 'NOASSERTION') {
        comp.supplier = { name: parseActorName(pkg.supplier) };
      }

      const licenses = extractSpdxLicenses(pkg);
      if (licenses.length > 0) comp.licenses = licenses;

      if (pkg.checksums && Array.isArray(pkg.checksums)) {
        comp.hashes = pkg.checksums.map(cs => ({
          alg: mapHashAlgorithm(cs.algorithm),
          content: cs.checksumValue
        })).filter(h => h.alg && h.content);
      }

      if (Array.isArray(pkg.externalRefs)) {
        for (const ref of pkg.externalRefs) {
          if (ref.referenceType === 'purl') {
            comp.purl = ref.referenceLocator;
          }
        }
      }

      if (pkg.copyrightText && pkg.copyrightText !== 'NOASSERTION') {
        comp.copyright = pkg.copyrightText;
      }

      if (pkg.description) comp.description = pkg.description;

      return comp;
    });
}

function convertRelationships(spdx) {
  const rels = Array.isArray(spdx.relationships) ? spdx.relationships : [];
  const depMap = new Map();

  for (const rel of rels) {
    if (rel.relationshipType === 'DEPENDS_ON') {
      const from = rel.spdxElementId;
      if (!depMap.has(from)) depMap.set(from, []);
      depMap.get(from).push(rel.relatedSpdxElement);
    }
  }

  return Array.from(depMap.entries()).map(([ref, deps]) => ({
    ref,
    dependsOn: deps
  }));
}

function mapPackageType(pkg) {
  if (pkg.primaryPackagePurpose) {
    const purpose = pkg.primaryPackagePurpose.toUpperCase();
    if (purpose === 'APPLICATION') return 'application';
    if (purpose === 'FRAMEWORK') return 'framework';
    if (purpose === 'LIBRARY') return 'library';
    if (purpose === 'OPERATING-SYSTEM') return 'operating-system';
    if (purpose === 'DEVICE') return 'device';
    if (purpose === 'FIRMWARE') return 'firmware';
    if (purpose === 'FILE') return 'file';
  }
  return 'library';
}

function parseActorName(actor) {
  if (!actor || typeof actor !== 'string') return '';
  const match = actor.match(/^(?:Organization|Person):\s*(.+?)(?:\s*\(.*\))?$/);
  return match ? match[1].trim() : actor;
}

function extractSpdxLicenses(pkg) {
  const licenses = [];
  if (pkg.licenseConcluded && pkg.licenseConcluded !== 'NOASSERTION') {
    if (pkg.licenseConcluded.includes(' AND ') || pkg.licenseConcluded.includes(' OR ')) {
      licenses.push({ expression: pkg.licenseConcluded });
    } else {
      licenses.push({ license: { id: pkg.licenseConcluded } });
    }
  } else if (pkg.licenseDeclared && pkg.licenseDeclared !== 'NOASSERTION') {
    licenses.push({ license: { id: pkg.licenseDeclared } });
  }
  return licenses;
}

function mapHashAlgorithm(alg) {
  if (!alg) return null;
  const map = {
    SHA1: 'SHA-1', SHA256: 'SHA-256', SHA384: 'SHA-384',
    SHA512: 'SHA-512', MD5: 'MD5', SHA3256: 'SHA3-256',
    SHA3384: 'SHA3-384', SHA3512: 'SHA3-512'
  };
  return map[alg.toUpperCase()] || alg;
}

module.exports = { spdxToCycloneDx, convertMetadata, convertPackages, convertRelationships, mapHashAlgorithm };
