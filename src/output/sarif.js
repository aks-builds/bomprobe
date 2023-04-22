const SEVERITY_MAP = {
  error: 'error',
  warning: 'warning',
  info: 'note'
};

function formatSarif(result) {
  const rules = [];
  const results = [];
  const ruleIndex = new Map();

  for (const check of (result.results || [])) {
    if (!ruleIndex.has(check.id)) {
      ruleIndex.set(check.id, rules.length);
      rules.push({
        id: check.id,
        shortDescription: { text: check.name },
        helpUri: `https://github.com/aks-builds/bomprobe#${check.id}`
      });
    }

    for (const f of check.findings) {
      results.push({
        ruleId: check.id,
        ruleIndex: ruleIndex.get(check.id),
        level: SEVERITY_MAP[f.severity] || 'note',
        message: { text: f.message },
        locations: f.component ? [{
          physicalLocation: {
            artifactLocation: { uri: f.component }
          }
        }] : []
      });
    }
  }

  return JSON.stringify({
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
    version: '2.1.0',
    runs: [{
      tool: {
        driver: {
          name: 'bomprobe',
          version: result.version || '0.1.0',
          informationUri: 'https://github.com/aks-builds/bomprobe',
          rules
        }
      },
      results
    }]
  }, null, 2);
}

module.exports = { formatSarif };
