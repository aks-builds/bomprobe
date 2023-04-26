function mergeSboms(primary, secondary) {
  const merged = { ...primary };
  const existingPurls = new Set();
  const existingRefs = new Set();

  for (const c of primary.components) {
    if (c.purl) existingPurls.add(c.purl);
    if (c['bom-ref']) existingRefs.add(c['bom-ref']);
  }

  const added = [];
  for (const c of secondary.components) {
    const key = c.purl || c['bom-ref'] || `${c.name}@${c.version}`;
    if (c.purl && existingPurls.has(c.purl)) continue;
    if (c['bom-ref'] && existingRefs.has(c['bom-ref'])) continue;
    if (!c.purl && !c['bom-ref'] && existingPurls.has(key)) continue;
    added.push(c);
    if (c.purl) existingPurls.add(c.purl);
    if (c['bom-ref']) existingRefs.add(c['bom-ref']);
  }

  merged.components = [...primary.components, ...added];

  const depRefs = new Set((primary.dependencies || []).map(d => d.ref));
  const extraDeps = (secondary.dependencies || []).filter(d => !depRefs.has(d.ref));
  merged.dependencies = [...(primary.dependencies || []), ...extraDeps];

  return { merged, added: added.length, duplicatesSkipped: secondary.components.length - added.length };
}

module.exports = { mergeSboms };
