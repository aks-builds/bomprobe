function cycloneDxToSpdx(cdx) {
  if (!cdx || typeof cdx !== 'object') return null;

  const spdx = {
    spdxVersion: 'SPDX-2.3',
    dataLicense: 'CC0-1.0',
    SPDXID: 'SPDXRef-DOCUMENT',
    name: cdx.metadata?.component?.name || 'converted-sbom',
    documentNamespace: `https://spdx.org/spdxdocs/bomprobe-${Date.now()}`,
    creationInfo: convertCreationInfo(cdx),
    packages: convertComponents(cdx),
    relationships: convertDependencies(cdx)
  };

  return spdx;
}

function convertCreationInfo(cdx) {
  const info = {
    created: cdx.metadata?.timestamp || new Date().toISOString(),
    creators: ['Tool:bomprobe']
  };

  if (Array.isArray(cdx.metadata?.tools)) {
    for (const tool of cdx.metadata.tools) {
      if (tool?.name) {
        info.creators.push(`Tool:${tool.name}${tool.version ? '-' + tool.version : ''}`);
      }
    }
  }

  if (cdx.metadata?.authors) {
    const authors = Array.isArray(cdx.metadata.authors) ? cdx.metadata.authors : [];
    for (const author of authors) {
      if (author?.name) info.creators.push(`Person: ${author.name}`);
    }
  }

  return info;
}

function convertComponents(cdx) {
  const components = Array.isArray(cdx.components) ? cdx.components : [];
  return components
    .filter(c => c && typeof c === 'object')
    .map(comp => {
      const pkg = {
        SPDXID: `SPDXRef-${sanitizeId(comp['bom-ref'] || comp.purl || comp.name || 'unknown')}`,
        name: comp.name || 'unknown',
        versionInfo: comp.version || '',
        downloadLocation: 'NOASSERTION',
        filesAnalyzed: false
      };

      if (comp.supplier?.name) {
        pkg.supplier = `Organization: ${comp.supplier.name}`;
      }

      if (comp.purl) {
        pkg.externalRefs = [{
          referenceCategory: 'PACKAGE-MANAGER',
          referenceType: 'purl',
          referenceLocator: comp.purl
        }];
      }

      if (Array.isArray(comp.licenses) && comp.licenses.length > 0) {
        const lic = comp.licenses[0];
        if (lic?.expression) {
          pkg.licenseConcluded = lic.expression;
        } else if (lic?.license?.id) {
          pkg.licenseConcluded = lic.license.id;
        } else {
          pkg.licenseConcluded = 'NOASSERTION';
        }
      } else {
        pkg.licenseConcluded = 'NOASSERTION';
      }
      pkg.licenseDeclared = pkg.licenseConcluded;

      pkg.copyrightText = comp.copyright || 'NOASSERTION';

      if (Array.isArray(comp.hashes)) {
        pkg.checksums = comp.hashes
          .filter(h => h?.alg && h?.content)
          .map(h => ({
            algorithm: mapHashToSpdx(h.alg),
            checksumValue: h.content
          }));
      }

      if (comp.description) pkg.description = comp.description;
      if (comp.type) pkg.primaryPackagePurpose = mapTypeToSpdx(comp.type);

      if (Array.isArray(comp.externalReferences)) {
        for (const ref of comp.externalReferences) {
          if (ref?.type === 'distribution' && ref?.url) {
            pkg.downloadLocation = ref.url;
            break;
          }
        }
      }

      return pkg;
    });
}

function convertDependencies(cdx) {
  const deps = Array.isArray(cdx.dependencies) ? cdx.dependencies : [];
  const rels = [];

  for (const dep of deps) {
    if (!dep?.ref) continue;
    const fromId = `SPDXRef-${sanitizeId(dep.ref)}`;
    const dependsOn = Array.isArray(dep.dependsOn) ? dep.dependsOn : [];
    for (const target of dependsOn) {
      rels.push({
        spdxElementId: fromId,
        relatedSpdxElement: `SPDXRef-${sanitizeId(target)}`,
        relationshipType: 'DEPENDS_ON'
      });
    }
  }

  return rels;
}

function sanitizeId(str) {
  return String(str).replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 128);
}

function mapHashToSpdx(alg) {
  const map = {
    'SHA-1': 'SHA1', 'SHA-256': 'SHA256', 'SHA-384': 'SHA384',
    'SHA-512': 'SHA512', 'MD5': 'MD5', 'SHA3-256': 'SHA3256',
    'SHA3-384': 'SHA3384', 'SHA3-512': 'SHA3512'
  };
  return map[alg] || alg;
}

function mapTypeToSpdx(type) {
  const map = {
    application: 'APPLICATION', framework: 'FRAMEWORK',
    library: 'LIBRARY', 'operating-system': 'OPERATING-SYSTEM',
    device: 'DEVICE', firmware: 'FIRMWARE', file: 'FILE'
  };
  return map[type] || 'LIBRARY';
}

module.exports = { cycloneDxToSpdx, convertCreationInfo, convertComponents, convertDependencies, mapHashToSpdx };
