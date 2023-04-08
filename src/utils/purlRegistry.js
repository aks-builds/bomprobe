const KNOWN_TYPES = [
  'npm', 'pypi', 'maven', 'gem', 'nuget', 'cargo',
  'golang', 'composer', 'cocoapods', 'swift', 'pub',
  'hex', 'cran', 'conda', 'generic', 'github',
  'docker', 'oci', 'huggingface', 'mlflow', 'conan',
  'apk', 'deb', 'rpm', 'bitbucket', 'hackage'
];

function isKnownType(type) {
  return KNOWN_TYPES.includes(type);
}

function categorizeType(type) {
  const categories = {
    language: ['npm', 'pypi', 'maven', 'gem', 'nuget', 'cargo', 'golang', 'composer', 'cocoapods', 'swift', 'pub', 'hex', 'cran', 'hackage'],
    container: ['docker', 'oci'],
    os: ['apk', 'deb', 'rpm'],
    ml: ['huggingface', 'mlflow'],
    generic: ['generic', 'github', 'bitbucket', 'conda', 'conan']
  };

  for (const [cat, types] of Object.entries(categories)) {
    if (types.includes(type)) return cat;
  }
  return 'unknown';
}

module.exports = { KNOWN_TYPES, isKnownType, categorizeType };
