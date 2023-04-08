function calculateAge(timestamp) {
  if (!timestamp) return null;
  const created = new Date(timestamp);
  if (isNaN(created.getTime())) return null;
  const now = new Date();
  const diffMs = now - created;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return { days, months: Math.floor(days / 30), years: Math.floor(days / 365) };
}

function isStale(timestamp, maxDays = 90) {
  const age = calculateAge(timestamp);
  if (!age) return false;
  return age.days > maxDays;
}

function formatAge(timestamp) {
  const age = calculateAge(timestamp);
  if (!age) return 'unknown';
  if (age.years > 0) return `${age.years} year${age.years > 1 ? 's' : ''} ago`;
  if (age.months > 0) return `${age.months} month${age.months > 1 ? 's' : ''} ago`;
  return `${age.days} day${age.days !== 1 ? 's' : ''} ago`;
}

module.exports = { calculateAge, isStale, formatAge };
