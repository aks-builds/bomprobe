function componentKey(c) {
  if (c.purl) return c.purl;
  return `${c.name || ''}@${c.version || ''}@${c.type || ''}`;
}

function mergeSboms(sboms, options = {}) {
  if (!Array.isArray(sboms) || sboms.length === 0) {
    return { bomFormat: 'CycloneDX', specVersion: '1.5', components: [], dependencies: [] };
  }

  if (sboms.length === 1) return sboms[0];

  const strategy = options.strategy || 'union';
  const componentMap = new Map();
  const depMap = new Map();
  const tools = [];
  let latestTimestamp = null;
  let highestSpec = '1.4';

  for (const sbom of sboms) {
    const spec = sbom.specVersion || '1.4';
    if (spec > highestSpec) highestSpec = spec;

    if (sbom.metadata?.timestamp) {
      if (!latestTimestamp || sbom.metadata.timestamp > latestTimestamp) {
        latestTimestamp = sbom.metadata.timestamp;
      }
    }

    if (Array.isArray(sbom.metadata?.tools)) {
      for (const t of sbom.metadata.tools) {
        const tk = `${t.name}@${t.version || ''}`;
        if (!tools.some(x => `${x.name}@${x.version || ''}` === tk)) tools.push(t);
      }
    }

    for (const c of (sbom.components || [])) {
      const key = componentKey(c);
      if (strategy === 'union') {
        if (!componentMap.has(key)) componentMap.set(key, c);
        else componentMap.set(key, mergeComponent(componentMap.get(key), c));
      } else if (strategy === 'intersect') {
        if (componentMap.has(key)) componentMap.set(key, mergeComponent(componentMap.get(key), c));
        else if (sboms.indexOf(sbom) === 0) componentMap.set(key, c);
      }
    }

    for (const d of (sbom.dependencies || [])) {
      const existing = depMap.get(d.ref);
      if (existing) {
        const merged = new Set([...existing, ...(d.dependsOn || [])]);
        depMap.set(d.ref, [...merged]);
      } else {
        depMap.set(d.ref, [...(d.dependsOn || [])]);
      }
    }
  }

  if (strategy === 'intersect') {
    for (const [key] of componentMap) {
      const inAll = sboms.every(s => (s.components || []).some(c => componentKey(c) === key));
      if (!inAll) componentMap.delete(key);
    }
  }

  return {
    bomFormat: 'CycloneDX',
    specVersion: highestSpec,
    metadata: {
      timestamp: latestTimestamp || new Date().toISOString(),
      tools: [{ name: 'bomprobe-merge', version: '1.0.0' }, ...tools]
    },
    components: [...componentMap.values()],
    dependencies: [...depMap.entries()].map(([ref, dependsOn]) => ({ ref, dependsOn }))
  };
}

function mergeComponent(a, b) {
  const merged = { ...a };
  if (!merged.purl && b.purl) merged.purl = b.purl;
  if (!merged.supplier && b.supplier) merged.supplier = b.supplier;
  if (!merged.description && b.description) merged.description = b.description;
  if (!merged.copyright && b.copyright) merged.copyright = b.copyright;

  if (b.hashes && Array.isArray(b.hashes)) {
    const existing = new Set((merged.hashes || []).map(h => `${h.alg}:${h.content}`));
    merged.hashes = [...(merged.hashes || [])];
    for (const h of b.hashes) {
      if (!existing.has(`${h.alg}:${h.content}`)) merged.hashes.push(h);
    }
  }

  if (b.externalReferences && Array.isArray(b.externalReferences)) {
    const existing = new Set((merged.externalReferences || []).map(r => r.url));
    merged.externalReferences = [...(merged.externalReferences || [])];
    for (const r of b.externalReferences) {
      if (!existing.has(r.url)) merged.externalReferences.push(r);
    }
  }

  return merged;
}

module.exports = { mergeSboms, mergeComponent, componentKey };
