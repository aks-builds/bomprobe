const { red, yellow, blue, green, bold, dim } = require('../utils/color');

function formatScore(score) {
  const bar = '='.repeat(Math.round(score.overall));
  const empty = ' '.repeat(10 - Math.round(score.overall));
  const colorFn = score.overall >= 7 ? green : score.overall >= 4 ? yellow : red;
  return `[${colorFn(bar)}${empty}] ${bold(score.overall + '/10')}`;
}

function formatResult(result) {
  const lines = [];

  lines.push(bold(`bomprobe: ${result.file}`));
  lines.push(`Format: ${result.format} (${result.componentCount} components)`);
  lines.push('');
  lines.push(`Score: ${formatScore(result.score)}`);
  lines.push(`  Components: ${result.score.components.average}/10`);
  lines.push(`  Metadata:   ${result.score.metadata}/10`);
  lines.push(`  Dependencies: ${result.score.dependencyCoverage}/10`);
  lines.push('');

  const findings = [];
  for (const check of result.checks) {
    for (const f of check.findings) {
      findings.push(f);
    }
  }

  if (findings.length === 0) {
    lines.push(green('No issues found.'));
  } else {
    lines.push(`${findings.length} issue${findings.length === 1 ? '' : 's'} found:`);
    lines.push('');
    for (const f of findings) {
      const icon = f.severity === 'error' ? red('ERR') : f.severity === 'warning' ? yellow('WRN') : blue('INF');
      lines.push(`  [${icon}] ${f.message}`);
    }
  }

  if (result.compliance) {
    lines.push('');
    const status = result.compliance.compliant ? green('PASS') : red('FAIL');
    lines.push(`NTIA Compliance: ${status}`);
    lines.push(`  ${result.compliance.summary}`);
    if (result.compliance.failed.length > 0) {
      for (const f of result.compliance.failed) {
        lines.push(`  ${red('FAIL')}: ${f.id} - ${f.reason}`);
      }
    }
  }

  return lines.join('\n');
}

module.exports = { formatResult };
