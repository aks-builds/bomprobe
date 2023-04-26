const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getProfile, listProfiles, applyProfile } = require('../../src/scoring/profile');

describe('scoring profiles', () => {
  it('gets supply chain profile', () => {
    const p = getProfile('supply_chain');
    assert.ok(p);
    assert.equal(p.name, 'Supply Chain Security');
  });

  it('returns null for unknown profile', () => {
    assert.equal(getProfile('nonexistent'), null);
  });

  it('lists all profiles', () => {
    const profiles = listProfiles();
    assert.ok(profiles.length >= 3);
    assert.ok(profiles.every(p => p.id && p.name && p.description));
  });

  it('applies profile weights to checks', () => {
    const profile = getProfile('supply_chain');
    const checks = [
      { id: 'component-hashes', weight: 0.1 },
      { id: 'component-name', weight: 0.2 }
    ];
    const result = applyProfile(profile, checks);
    assert.equal(result[0].weight, 0.5);
    assert.equal(result[1].weight, 0.2);
  });

  it('profile has check count', () => {
    const profiles = listProfiles();
    assert.ok(profiles.every(p => typeof p.checkCount === 'number'));
  });
});
