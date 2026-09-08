import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseMeal, formatEstimate } from './nutrition.js';
import { safeReply, validateProfile } from './policy.js';
import { addMeal, addWater, addWorkout, calendarDays, clearMeals, clearMealsForDate, dailySummary, readStore, setGoal, waterSummary, workoutSummary } from './store.js';
import { waterGuidance } from './water.js';
import { momentum, workoutSuggestion } from './fitness.js';

const publicDir = path.resolve('public');
const json = (res, status, payload) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(payload)); };
const readBody = async (req) => { let text = ''; for await (const chunk of req) text += chunk; return text ? JSON.parse(text) : {}; };
const dateOf = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? '') ? value : new Date().toISOString().slice(0, 10);

function encouragement(summary, goal) {
  if (!goal?.dailyTarget || summary.count === 0) return 'Minden rögzített étkezés egy tudatosabb nap alapja. Jó munka, hogy vezeted a naplót!';
  const ratio = summary.totals.kcal / goal.dailyTarget;
  if (ratio >= .95 && ratio <= 1.05) return 'Szuper munka! A napi célod közelében vagy — ez következetes naplózás.';
  if (ratio < .95) return 'Jól haladsz. A nap még nincs lezárva; figyeld az éhségérzetedet és az étkezések minőségét is.';
  return 'A cél fölé kerültél, ez egyetlen napon teljesen rendben lehet. A trend számít, nem a tökéletesség.';
}

function performance(data, goal) {
  const today = new Date(); const days = [];
  for (let offset = 6; offset >= 0; offset -= 1) { const day = new Date(today); day.setDate(today.getDate() - offset); days.push(day.toISOString().slice(0, 10)); }
  const loggedDays = days.filter((date) => dailySummary(data.meals, date).count > 0).length;
  const workoutDays = days.filter((date) => workoutSummary(data.workouts, date).entries.length > 0).length;
  const targetDays = goal?.dailyTarget ? days.filter((date) => { const kcal = dailySummary(data.meals, date).totals.kcal; return kcal >= goal.dailyTarget * .85 && kcal <= goal.dailyTarget * 1.15; }).length : null;
  return { loggedDays, workoutDays, targetDays, windowDays: 7, activeDates: days.filter((date) => dailySummary(data.meals, date).count > 0), workoutDates: days.filter((date) => workoutSummary(data.workouts, date).entries.length > 0), message: loggedDays >= 5 ? 'Erős ritmus: ezen a héten következetesen naplózol.' : loggedDays >= 2 ? 'Jó alap. Még néhány rögzített nap, és látszik a heti mintázat.' : 'Kezdd egyetlen étkezés rögzítésével — a következetesség így épül.' };
}

async function dashboard(date) {
  const data = await readStore(); const summary = dailySummary(data.meals, date); const water = waterSummary(data.water, date); const workouts = workoutSummary(data.workouts, date); const guide = waterGuidance(data.goal?.age, data.goal?.sex); const weekly = performance(data, data.goal);
  return { date, summary, water, waterGuide: guide, workouts, meals: data.meals.filter((m) => (m.loggedDate ?? m.createdAt.slice(0, 10)) === date), goal: data.goal, performance: weekly, encouragement: encouragement(summary, data.goal), suggestion: workoutSuggestion(data.goal, workouts.entries), momentum: momentum({ summary, water, waterGuide: guide, workouts: workouts.entries, performance: weekly, goal: data.goal }) };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/chat' && req.method === 'POST') {
      const { text = '', profile = {} } = await readBody(req);
      const policy = safeReply(text, profile);
      if (!policy.allowed) return json(res, 200, { reply: policy.message, action: 'blocked' });
      if (/osszesites|ma ettem|mai nap/i.test(text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
        const data = await readStore(); const summary = dailySummary(data.meals);
        return json(res, 200, { reply: `Ma ${summary.count} etkezest rogzítettél: kb. ${summary.totals.kcal} kcal, feherje ${summary.totals.protein} g, szenhidrat ${summary.totals.carbs} g, zsir ${summary.totals.fat} g. ${encouragement(summary, data.goal)}`, summary });
      }
      const estimate = parseMeal(text);
      return json(res, 200, { reply: formatEstimate(estimate), estimate, action: estimate.status === 'ok' ? 'estimate' : 'clarify' });
    }
    if (url.pathname === '/api/meals' && req.method === 'GET') {
      return json(res, 200, await dashboard(dateOf(url.searchParams.get('date'))));
    }
    if (url.pathname === '/api/dashboard' && req.method === 'GET') return json(res, 200, await dashboard(dateOf(url.searchParams.get('date'))));
    if (url.pathname === '/api/meals' && req.method === 'POST') {
      const { text = '', profile = {}, loggedDate } = await readBody(req);
      const policy = safeReply(text, profile); if (!policy.allowed) return json(res, 422, policy);
      const estimate = parseMeal(text); if (estimate.status !== 'ok') return json(res, 422, estimate);
      return json(res, 201, { meal: await addMeal({ text, estimate, loggedDate: dateOf(loggedDate) }) });
    }
    if (url.pathname === '/api/meals' && req.method === 'DELETE') {
      const date = url.searchParams.get('date');
      if (date) await clearMealsForDate(date); else await clearMeals();
      return json(res, 204, {});
    }
    if (url.pathname === '/api/water' && req.method === 'POST') {
      const { amountMl, loggedDate } = await readBody(req);
      return json(res, 201, { water: await addWater({ amountMl, loggedDate: dateOf(loggedDate) }) });
    }
    if (url.pathname === '/api/workouts' && req.method === 'POST') {
      const workout = await readBody(req);
      if (!['strength', 'cardio', 'mobility', 'sport'].includes(workout.type)) return json(res, 422, { message: 'Válassz edzéstípust.' });
      return json(res, 201, { workout: await addWorkout({ ...workout, loggedDate: dateOf(workout.loggedDate) }) });
    }
    if (url.pathname === '/api/workouts' && req.method === 'GET') {
      const data = await readStore(); return json(res, 200, workoutSummary(data.workouts, dateOf(url.searchParams.get('date'))));
    }
    if (url.pathname === '/api/calendar' && req.method === 'GET') {
      const month = /^\d{4}-\d{2}$/.test(url.searchParams.get('month') ?? '') ? url.searchParams.get('month') : new Date().toISOString().slice(0, 7);
      const data = await readStore(); return json(res, 200, { month, days: calendarDays(data.meals, data.water, data.workouts, month) });
    }
    if (url.pathname === '/api/goal' && req.method === 'PUT') {
      const goal = await readBody(req); const check = validateProfile(goal);
      if (!check.allowed) return json(res, 422, check);
      const dailyTarget = Number(goal.dailyTarget);
      if (!Number.isFinite(dailyTarget) || dailyTarget <= 0) return json(res, 422, { message: 'Adj meg egy pozitív, napi kalóriacélt.' });
      return json(res, 200, { goal: await setGoal({ dailyTarget: Math.round(dailyTarget), age: goal.age ? Number(goal.age) : null, sex: ['female', 'male', 'other'].includes(goal.sex) ? goal.sex : null, trainingGoal: ['strength', 'endurance', 'mobility', 'general'].includes(goal.trainingGoal) ? goal.trainingGoal : 'general', experience: ['beginner', 'regular', 'advanced'].includes(goal.experience) ? goal.experience : 'beginner', daysPerWeek: [2, 3, 4, 5, 6].includes(Number(goal.daysPerWeek)) ? Number(goal.daysPerWeek) : 3, updatedAt: new Date().toISOString() }) });
    }
    const filePath = url.pathname === '/' ? path.join(publicDir, 'index.html') : path.join(publicDir, url.pathname);
    if (!filePath.startsWith(publicDir)) return json(res, 403, { error: 'Tiltott utvonal' });
    const content = await fs.readFile(filePath);
    const type = filePath.endsWith('.css') ? 'text/css; charset=utf-8' : filePath.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8';
    res.writeHead(200, { 'content-type': type }); res.end(content);
  } catch (error) { json(res, error instanceof SyntaxError ? 400 : 500, { error: 'A keres feldolgozasa nem sikerult.' }); }
});
server.listen(process.env.PORT || 3000, () => console.log('Kaloria Asszisztens: http://localhost:3000'));
