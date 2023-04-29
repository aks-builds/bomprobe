const { readdirSync, statSync } = require('node:fs');
const { join, relative } = require('node:path');

function findSbomFiles(dir, maxDepth = 3) {
  const files = [];
  const sbomPatterns = [
    /bom\.json$/i,
    /sbom\.json$/i,
    /cyclonedx.*\.json$/i,
    /spdx.*\.json$/i,
    /\.cdx\.json$/i
  ];

  function walk(current, depth) {
    if (depth > maxDepth) return;
    let entries;
    try { entries = readdirSync(current); } catch { return; }

    for (const entry of entries) {
      if (entry.startsWith('.') || entry === 'node_modules') continue;
      const full = join(current, entry);
      let stat;
      try { stat = statSync(full); } catch { continue; }

      if (stat.isDirectory()) {
        walk(full, depth + 1);
      } else if (sbomPatterns.some(p => p.test(entry))) {
        files.push(full);
      }
    }
  }

  walk(dir, 0);
  return files;
}

function batchAudit(files, auditFn, options = {}) {
  const results = [];
  for (const file of files) {
    const result = auditFn(file, options);
    results.push({ file, result });
  }
  return results;
}

function formatBatchSummary(results, baseDir) {
  const lines = [];
  lines.push(`Scanned ${results.length} SBOM files\n`);

  let passing = 0;
  let failing = 0;

  for (const { file, result } of results) {
    const rel = baseDir ? relative(baseDir, file) : file;
    if (result.error) {
      lines.push(`  FAIL  ${rel} - ${result.error}`);
      failing++;
      continue;
    }

    const score = result.score?.overall ?? 0;
    const total = result.checks.reduce((s, c) => s + c.findings.length, 0);
    const errors = result.checks.reduce(
      (s, c) => s + c.findings.filter(f => f.severity === 'error').length, 0
    );

    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C'
      : score >= 60 ? 'D' : 'F';
    const status = errors > 0 ? 'FAIL' : 'PASS';

    if (errors > 0) failing++;
    else passing++;

    lines.push(`  ${status}  ${rel}  score=${score.toFixed(1)} grade=${grade} findings=${total} errors=${errors}`);
  }

  lines.push('');
  lines.push(`${passing} passed, ${failing} failed`);
  return lines.join('\n');
}

module.exports = { findSbomFiles, batchAudit, formatBatchSummary };
