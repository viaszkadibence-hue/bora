import fs from 'node:fs/promises';
import path from 'node:path';

const file = path.resolve('data/store.json');
const blank = { meals: [], water: [], workouts: [], goal: null };

export async function readStore() {
  try {
    const data = JSON.parse(await fs.readFile(file, 'utf8'));
    return { ...blank, ...data, meals: data.meals ?? [], water: data.water ?? [], workouts: data.workouts ?? [] };
  } catch { return { ...blank }; }
}

export async function saveStore(data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

export async function addMeal(meal) {
  const data = await readStore();
  const loggedDate = /^\d{4}-\d{2}-\d{2}$/.test(meal.loggedDate) ? meal.loggedDate : new Date().toISOString().slice(0, 10);
  const entry = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), loggedDate, ...meal };
  data.meals.push(entry);
  await saveStore(data);
  return entry;
}

export async function addWater(entry) {
  const data = await readStore();
  const loggedDate = /^\d{4}-\d{2}-\d{2}$/.test(entry.loggedDate) ? entry.loggedDate : new Date().toISOString().slice(0, 10);
  const amountMl = Math.round(Number(entry.amountMl));
  if (!Number.isFinite(amountMl) || amountMl < 50 || amountMl > 3000) throw new Error('Invalid water amount');
  const item = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), loggedDate, amountMl };
  data.water.push(item); await saveStore(data); return item;
}

export async function addWorkout(workout) {
  const data = await readStore();
  const loggedDate = /^\d{4}-\d{2}-\d{2}$/.test(workout.loggedDate) ? workout.loggedDate : new Date().toISOString().slice(0, 10);
  const durationMinutes = Math.round(Number(workout.durationMinutes));
  const effort = Math.round(Number(workout.effort));
  if (!Number.isFinite(durationMinutes) || durationMinutes < 5 || durationMinutes > 360) throw new Error('Invalid workout duration');
  if (!Number.isFinite(effort) || effort < 1 || effort > 5) throw new Error('Invalid workout effort');
  const item = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), loggedDate, type: workout.type, title: String(workout.title || '').slice(0, 80), durationMinutes, effort };
  data.workouts.push(item); await saveStore(data); return item;
}

export async function setGoal(goal) { const data = await readStore(); data.goal = goal; await saveStore(data); return data.goal; }
export async function clearMeals() { const data = await readStore(); data.meals = []; await saveStore(data); }
export async function clearMealsForDate(date) {
  const data = await readStore();
  data.meals = data.meals.filter((meal) => (meal.loggedDate ?? meal.createdAt.slice(0, 10)) !== date);
  await saveStore(data);
}

export function dailySummary(meals, date = new Date().toISOString().slice(0, 10)) {
  const selected = meals.filter((m) => (m.loggedDate ?? m.createdAt.slice(0, 10)) === date);
  const totals = selected.reduce((a, m) => {
    for (const key of ['kcal', 'protein', 'carbs', 'fat']) a[key] += m.estimate.macros[key];
    return a;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
  return { date, count: selected.length, totals: Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, Math.round(value * 10) / 10])) };
}

export function waterSummary(water, date) {
  const entries = water.filter((item) => (item.loggedDate ?? item.createdAt.slice(0, 10)) === date);
  return { date, amountMl: entries.reduce((sum, item) => sum + item.amountMl, 0), entries };
}

export function workoutSummary(workouts, date) {
  const entries = workouts.filter((item) => (item.loggedDate ?? item.createdAt.slice(0, 10)) === date);
  return { date, entries, minutes: entries.reduce((sum, item) => sum + item.durationMinutes, 0) };
}

export function calendarDays(meals, water, workouts, month) {
  const days = {};
  for (const meal of meals) { const date = meal.loggedDate ?? meal.createdAt.slice(0, 10); if (date.startsWith(month)) { days[date] ??= { meals: 0, kcal: 0, waterMl: 0 }; days[date].meals += 1; days[date].kcal += meal.estimate.macros.kcal; } }
  for (const drink of water) { const date = drink.loggedDate ?? drink.createdAt.slice(0, 10); if (date.startsWith(month)) { days[date] ??= { meals: 0, kcal: 0, waterMl: 0 }; days[date].waterMl += drink.amountMl; } }
  for (const workout of workouts) { const date = workout.loggedDate ?? workout.createdAt.slice(0, 10); if (date.startsWith(month)) { days[date] ??= { meals: 0, kcal: 0, waterMl: 0, workouts: 0 }; days[date].workouts = (days[date].workouts ?? 0) + 1; } }
  return days;
}
