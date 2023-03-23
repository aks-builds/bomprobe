function createProfile(name, requiredChecks) {
  return {
    name,
    requiredChecks,
    evaluate(checkResults) {
      const passed = [];
      const failed = [];

      for (const id of requiredChecks) {
        const result = checkResults.find(c => c.id === id);
        if (!result) {
          failed.push(id);
          continue;
        }
        const hasErrors = result.findings.some(f => f.severity === 'error');
        if (hasErrors) {
          failed.push(id);
        } else {
          passed.push(id);
        }
      }

      return {
        profile: name,
        compliant: failed.length === 0,
        passed,
        failed,
        summary: `${passed.length}/${requiredChecks.length} checks passed`
      };
    }
  };
}

module.exports = { createProfile };
