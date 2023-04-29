function formatAnnotations(results, bomFile = 'sbom.json') {
  const lines = [];

  for (const r of results) {
    for (const f of (r.findings || [])) {
      const level = f.severity === 'error' ? 'error'
        : f.severity === 'warning' ? 'warning'
        : 'notice';

      lines.push(
        `::${level} file=${bomFile},title=${r.id}::${f.message || r.name + ' check failed'}`
      );
    }
  }

  return lines.join('\n');
}

function countAnnotations(results) {
  let errors = 0;
  let warnings = 0;
  let notices = 0;

  for (const r of results) {
    for (const f of (r.findings || [])) {
      if (f.severity === 'error') errors++;
      else if (f.severity === 'warning') warnings++;
      else notices++;
    }
  }

  return { errors, warnings, notices, total: errors + warnings + notices };
}

module.exports = { formatAnnotations, countAnnotations };
