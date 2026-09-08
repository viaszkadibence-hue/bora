import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMeal } from '../src/nutrition.js';
import { validateProfile } from '../src/policy.js';
import { waterGuidance } from '../src/water.js';
import { momentum, workoutSuggestion } from '../src/fitness.js';

test('grammos csirkét becsül', () => { const e = parseMeal('200 g csirkemell'); assert.equal(e.status, 'ok'); assert.equal(e.macros.kcal, 330); });
test('adag nélkül pontosítást kér', () => assert.equal(parseMeal('rizs').status, 'clarify'));
test('kiskorúnak alacsony cél tiltott', () => assert.equal(validateProfile({ age: 16, dailyTarget: 1400 }).allowed, false));
test('a vízirányérték kor és nem szerint változik', () => {
  assert.equal(waterGuidance(30, 'male').targetMl, 2500);
  assert.equal(waterGuidance(10, 'female').targetMl, 1900);
});
test('a Momentum kiemeli a következő naplózási lépést', () => {
  const result = momentum({ summary: { count: 0, totals: { kcal: 0 } }, water: { amountMl: 0 }, waterGuide: null, workouts: [], performance: { loggedDays: 0 }, goal: null });
  assert.equal(result.score, 0);
  assert.match(result.next, /étkezést/);
  assert.equal(workoutSuggestion({ trainingGoal: 'mobility' }).type, 'mobility');
});
