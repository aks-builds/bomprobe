function analyzeComponentAge(sbom) {
  const components = Array.isArray(sbom?.components) ? sbom.components : [];
  const results = [];
  const now = new Date();

  for (const comp of components) {
    if (!comp || typeof comp !== 'object') continue;

    const name = comp.name || 'unknown';
    const version = comp.version || 'unknown';
    let releaseDate = null;
    let ageInDays = null;

    if (comp.releaseNotes?.timestamp) {
      releaseDate = parseDate(comp.releaseNotes.timestamp);
    }
    if (!releaseDate && Array.isArray(comp.externalReferences)) {
      for (const ref of comp.externalReferences) {
        if (ref.type === 'release-notes' && ref.comment) {
          releaseDate = parseDate(ref.comment);
          if (releaseDate) break;
        }
      }
    }
    if (!releaseDate && comp.properties) {
      const dateProp = findProperty(comp.properties, ['release-date', 'published', 'date']);
      if (dateProp) releaseDate = parseDate(dateProp);
    }

    if (releaseDate) {
      ageInDays = Math.floor((now - releaseDate) / (1000 * 60 * 60 * 24));
    }

    results.push({
      name,
      version,
      purl: comp.purl || null,
      releaseDate: releaseDate ? releaseDate.toISOString().split('T')[0] : null,
      ageInDays,
      ageCategory: categorizeAge(ageInDays),
      hasVersion: version !== 'unknown',
      hasReleaseDate: releaseDate !== null
    });
  }

  return results;
}

function parseDate(str) {
  if (!str || typeof str !== 'string') return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function findProperty(props, keys) {
  if (!Array.isArray(props)) return null;
  for (const p of props) {
    if (p && keys.some(k => (p.name || '').toLowerCase().includes(k))) {
      return p.value;
    }
  }
  return null;
}

function categorizeAge(days) {
  if (days === null) return 'unknown';
  if (days <= 90) return 'recent';
  if (days <= 365) return 'current';
  if (days <= 730) return 'aging';
  if (days <= 1095) return 'old';
  return 'ancient';
}

function summarizeAge(results) {
  const categories = { recent: 0, current: 0, aging: 0, old: 0, ancient: 0, unknown: 0 };
  let withDate = 0;

  for (const r of results) {
    categories[r.ageCategory]++;
    if (r.hasReleaseDate) withDate++;
  }

  const datedResults = results.filter(r => r.ageInDays !== null);
  const ages = datedResults.map(r => r.ageInDays);
  const avgAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : null;
  const maxAge = ages.length > 0 ? Math.max(...ages) : null;
  const medianAge = ages.length > 0 ? ages.sort((a, b) => a - b)[Math.floor(ages.length / 2)] : null;

  return {
    total: results.length,
    withReleaseDate: withDate,
    coverage: results.length > 0 ? Math.round(withDate / results.length * 100) : 0,
    categories,
    avgAgeDays: avgAge,
    maxAgeDays: maxAge,
    medianAgeDays: medianAge,
    stale: results.filter(r => r.ageCategory === 'old' || r.ageCategory === 'ancient')
  };
}

function formatAge(summary) {
  const lines = [];
  lines.push('Component Age Analysis');
  lines.push('======================');
  lines.push(`Total components: ${summary.total}`);
  lines.push(`Date coverage: ${summary.coverage}% (${summary.withReleaseDate}/${summary.total})`);

  if (summary.avgAgeDays !== null) {
    lines.push(`Average age: ${summary.avgAgeDays} days`);
    lines.push(`Median age: ${summary.medianAgeDays} days`);
    lines.push(`Oldest: ${summary.maxAgeDays} days`);
  }

  lines.push('\nDistribution:');
  lines.push(`  Recent (< 90d):    ${summary.categories.recent}`);
  lines.push(`  Current (< 1y):    ${summary.categories.current}`);
  lines.push(`  Aging (< 2y):      ${summary.categories.aging}`);
  lines.push(`  Old (< 3y):        ${summary.categories.old}`);
  lines.push(`  Ancient (3y+):     ${summary.categories.ancient}`);
  lines.push(`  Unknown:           ${summary.categories.unknown}`);

  if (summary.stale.length > 0) {
    lines.push(`\nStale components (${summary.stale.length}):`);
    for (const s of summary.stale.slice(0, 15)) {
      const age = s.ageInDays ? `${s.ageInDays}d` : '?';
      lines.push(`  ${s.name}@${s.version} (${age})`);
    }
  }

  return lines.join('\n');
}

module.exports = { analyzeComponentAge, summarizeAge, formatAge, categorizeAge, parseDate };
