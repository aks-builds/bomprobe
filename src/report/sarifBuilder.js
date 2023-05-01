function buildSarif(auditResult, sbomPath) {
  const rules = [];
  const results = [];
  const ruleIndex = new Map();

  const checks = Array.isArray(auditResult.checks) ? auditResult.checks : [];
  for (const check of checks) {
    if (!check.findings || check.findings.length === 0) continue;

    if (!ruleIndex.has(check.id)) {
      ruleIndex.set(check.id, rules.length);
      rules.push({
        id: check.id,
        name: check.name || check.id,
        shortDescription: { text: check.description || check.id },
        defaultConfiguration: { level: mapSeverityToLevel(check.severity || 'info') },
        properties: { tags: ['sbom', 'quality'] }
      });
    }

    for (const finding of check.findings) {
      results.push({
        ruleId: check.id,
        ruleIndex: ruleIndex.get(check.id),
        level: mapSeverityToLevel(finding.severity || check.severity || 'info'),
        message: { text: finding.message || `${check.id}: finding` },
        locations: [{
          physicalLocation: {
            artifactLocation: { uri: sbomPath || 'sbom.json', uriBaseId: '%SRCROOT%' },
            region: { startLine: 1 }
          }
        }],
        properties: {
          component: finding.component || null,
          checkId: check.id
        }
      });
    }
  }

  return {
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/main/sarif-2.1/schema/sarif-schema-2.1.0.json',
    version: '2.1.0',
    runs: [{
      tool: {
        driver: {
          name: 'bomprobe',
          version: auditResult.version || '1.1.0',
          informationUri: 'https://github.com/aks-builds/bomprobe',
          rules
        }
      },
      results,
      invocations: [{
        executionSuccessful: true,
        toolExecutionNotifications: []
      }]
    }]
  };
}

function mapSeverityToLevel(severity) {
  switch ((severity || '').toLowerCase()) {
    case 'error': case 'critical': case 'high': return 'error';
    case 'warning': case 'medium': return 'warning';
    case 'info': case 'low': return 'note';
    default: return 'note';
  }
}

function formatSarif(sarif) {
  return JSON.stringify(sarif, null, 2);
}

module.exports = { buildSarif, formatSarif, mapSeverityToLevel };
