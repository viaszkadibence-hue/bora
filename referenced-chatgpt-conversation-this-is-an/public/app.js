const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const today = new Date().toISOString().slice(0, 10);
let current = null, currentEstimate = null, calendarMonth = today.slice(0, 7);
$('#loggedDate').value = today;

async function api(url, options = {}) {
  const response = await fetch(url, { headers: { 'content-type': 'application/json' }, ...options });
  return { ok: response.ok, data: await response.json().catch(() => ({})) };
}
const fmt = (value) => new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(value ?? 0);
const escape = (value) => { const el = document.createElement('div'); el.textContent = value; return el.innerHTML; };
const setReply = (text, kind = '') => { $('#reply').textContent = text; $('#reply').className = `reply ${kind}`; };
const profile = () => ({ age: $('#age').value || undefined, sex: $('#sex').value || undefined, dailyTarget: $('#target').value || undefined, trainingGoal: $('#trainingGoal').value, experience: $('#experience').value, daysPerWeek: $('#daysPerWeek').value });

function activate(name) {
  $$('.view').forEach((view) => view.classList.toggle('active', view.id === name));
  $$('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render(data) {
  current = data;
  const { summary, water, waterGuide, workouts, performance, momentum, suggestion, goal } = data;
  $('#todayLabel').textContent = summary.date === today ? 'MAI NAP' : summary.date;
  $('#kcalValue').textContent = fmt(summary.totals.kcal);
  $('#kcalBar').style.width = `${goal?.dailyTarget ? Math.min(summary.totals.kcal / goal.dailyTarget, 1) * 100 : 0}%`;
  $('#goalStatus').textContent = goal?.dailyTarget ? `${fmt(summary.totals.kcal)} / ${fmt(goal.dailyTarget)} kcal` : 'Állíts be egy célértéket.';
  $('#waterValue').textContent = `${fmt(water.amountMl)} ml`;
  $('#waterGoal').textContent = waterGuide ? `${fmt(waterGuide.targetMl)} ml irányérték` : 'Életkor + nem szükséges';
  $('#waterProgress').style.width = `${waterGuide ? Math.min(water.amountMl / waterGuide.targetMl, 1) * 100 : 0}%`;
  $('#waterStatus').textContent = waterGuide ? `${waterGuide.label}. Irányérték, melyet sport, időjárás és egészségi állapot módosíthat.` : 'A személyes folyadékirányértékhez add meg az életkort és nemet a profilban.';
  $('#workoutMinutes').textContent = fmt(workouts.minutes);
  $('#workoutBar').style.width = `${Math.min(workouts.minutes / 45, 1) * 100}%`;
  $('#workoutStatus').textContent = workouts.entries.length ? `${workouts.entries.length} mozgás rögzítve ma` : 'Még nincs edzés rögzítve';
  $('#loggedDays').textContent = `${performance.loggedDays}/7`;
  $('#performanceText').textContent = performance.message;
  $('#weekDots').innerHTML = Array.from({ length: 7 }, (_, index) => { const day = new Date(); day.setDate(day.getDate() - 6 + index); const date = day.toISOString().slice(0, 10); const active = performance.activeDates.includes(date) || performance.workoutDates.includes(date); return `<span class="${active ? 'active' : ''}" title="${date}">${day.toLocaleDateString('hu-HU', { weekday: 'narrow' })}</span>`; }).join('');
  $('#momentumScore').textContent = momentum.score; $('#momentumLabel').textContent = momentum.label; $('#momentumNext').textContent = momentum.next; $('#scoreRing').style.setProperty('--score', `${momentum.score * 3.6}deg`);
  $('#suggestionTitle').textContent = suggestion.title; $('#suggestionDetail').textContent = suggestion.detail; $('#suggestionIcon').textContent = suggestion.type === 'cardio' ? '↗' : suggestion.type === 'mobility' ? '○' : suggestion.type === 'recovery' ? '✓' : '◆';
  $('#encouragement').textContent = data.encouragement;
  $('#protein').textContent = `${fmt(summary.totals.protein)} g`; $('#carbs').textContent = `${fmt(summary.totals.carbs)} g`; $('#fat').textContent = `${fmt(summary.totals.fat)} g`;
  $('#mealHeading').textContent = summary.date === today ? 'Mai napló' : `${summary.date} naplója`;
  $('#mealList').innerHTML = data.meals.length ? data.meals.slice().reverse().map((meal) => `<article class="entry"><div class="entry-icon fuel">◒</div><div><strong>${escape(meal.text)}</strong><small>${meal.estimate.food} · ${meal.estimate.grams} g</small></div><b>${fmt(meal.estimate.macros.kcal)}<small>kcal</small></b></article>`).join('') : '<p class="empty">Még nincs étkezés rögzítve ezen a napon.</p>';
  $('#workoutCount').textContent = `${workouts.entries.length} edzés`;
  $('#workoutList').innerHTML = workouts.entries.length ? workouts.entries.slice().reverse().map((workout) => `<article class="entry"><div class="entry-icon train">${workout.type === 'cardio' ? '↗' : workout.type === 'mobility' ? '○' : '◆'}</div><div><strong>${escape(workout.title || 'Edzés')}</strong><small>${workout.type} · érzet ${workout.effort}/5</small></div><b>${workout.durationMinutes}<small>perc</small></b></article>`).join('') : '<p class="empty">Még nincs mozgás rögzítve. Egy rövid séta vagy mobilitás is számít.</p>';
  $('#planTitle').textContent = suggestion.title; $('#planDetail').textContent = suggestion.detail;
  $('#weeklyLogged').textContent = performance.loggedDays; $('#weeklyWorkouts').textContent = performance.workoutDays; $('#weeklyText').textContent = performance.message;
}

async function refresh() {
  const result = await api(`/api/dashboard?date=${$('#loggedDate').value}`);
  if (!result.ok) { setReply('A háttérszolgáltatás nem válaszol. Indítsd újra az alkalmazást a projektmappából.', 'blocked'); return; }
  render(result.data);
}

async function renderCalendar() {
  const result = await api(`/api/calendar?month=${calendarMonth}`); if (!result.ok) return;
  const { days } = result.data; const [year, month] = calendarMonth.split('-').map(Number); const first = new Date(year, month - 1, 1); const total = new Date(year, month, 0).getDate(); const offset = (first.getDay() + 6) % 7;
  $('#calendarTitle').textContent = first.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' });
  let markup = '<span class="calendar-blank"></span>'.repeat(offset);
  for (let day = 1; day <= total; day += 1) { const date = `${calendarMonth}-${String(day).padStart(2, '0')}`; const item = days[date]; markup += `<button class="calendar-day ${date === $('#loggedDate').value ? 'selected' : ''}" data-date="${date}"><b>${day}</b><i class="${item?.meals ? 'meal-dot' : ''}"></i><i class="${item?.waterMl ? 'water-dot' : ''}"></i><i class="${item?.workouts ? 'workout-dot' : ''}"></i></button>`; }
  $('#calendar').innerHTML = markup;
  $$('.calendar-day').forEach((button) => button.onclick = () => { $('#loggedDate').value = button.dataset.date; refresh(); renderCalendar(); });
}

$$('.nav-item').forEach((button) => button.onclick = () => activate(button.dataset.view));
$('#suggestionAction').onclick = () => activate('train');
$('#loggedDate').onchange = () => { refresh(); renderCalendar(); };
$('#foodForm').onsubmit = async (event) => { event.preventDefault(); const text = $('#text').value.trim(); const { data } = await api('/api/chat', { method: 'POST', body: JSON.stringify({ text, profile: profile() }) }); currentEstimate = data.estimate ?? null; setReply(data.reply ?? data.error, data.action ?? ''); $('#save').disabled = currentEstimate?.status !== 'ok'; };
$('#save').onclick = async () => { const text = $('#text').value.trim(); const { ok, data } = await api('/api/meals', { method: 'POST', body: JSON.stringify({ text, profile: profile(), loggedDate: $('#loggedDate').value }) }); if (!ok) return setReply(data.message ?? data.error, 'blocked'); setReply('Az étkezés rögzítve. Jó munka!', 'success'); $('#text').value = ''; $('#save').disabled = true; refresh(); renderCalendar(); };
$$('[data-water]').forEach((button) => button.onclick = async () => { const { ok, data } = await api('/api/water', { method: 'POST', body: JSON.stringify({ amountMl: Number(button.dataset.water), loggedDate: $('#loggedDate').value }) }); if (!ok) return; $('#waterStatus').textContent = `${data.water.amountMl} ml folyadék rögzítve.`; refresh(); renderCalendar(); });
$('#workoutForm').onsubmit = async (event) => { event.preventDefault(); const payload = { type: $('#workoutType').value, title: $('#workoutTitle').value.trim(), durationMinutes: $('#workoutDuration').value, effort: $('#workoutEffort').value, loggedDate: $('#loggedDate').value }; const { ok, data } = await api('/api/workouts', { method: 'POST', body: JSON.stringify(payload) }); $('#workoutMessage').textContent = ok ? 'Edzés elmentve. Ez is építi a ritmust.' : (data.message ?? 'Az edzés mentése nem sikerült.'); $('#workoutMessage').className = `form-message ${ok ? 'success' : 'error'}`; if (ok) { $('#workoutTitle').value = ''; refresh(); renderCalendar(); } };
$('#clear').onclick = async () => { if (!confirm(`Biztosan törlöd a kiválasztott nap (${ $('#loggedDate').value }) étkezéseit?`)) return; await api(`/api/meals?date=${$('#loggedDate').value}`, { method: 'DELETE' }); refresh(); renderCalendar(); };
$('#openGoal').onclick = () => { const goal = current?.goal; $('#age').value = goal?.age ?? ''; $('#sex').value = goal?.sex ?? ''; $('#target').value = goal?.dailyTarget ?? ''; $('#trainingGoal').value = goal?.trainingGoal ?? 'general'; $('#experience').value = goal?.experience ?? 'beginner'; $('#daysPerWeek').value = goal?.daysPerWeek ?? 3; $('#goalDialog').showModal(); };
$('#goalForm').onsubmit = async (event) => { event.preventDefault(); const { ok, data } = await api('/api/goal', { method: 'PUT', body: JSON.stringify(profile()) }); if (!ok) return $('#goalError').textContent = data.message; $('#goalError').textContent = ''; $('#goalDialog').close(); refresh(); };
function moveMonth(delta) { const [year, month] = calendarMonth.split('-').map(Number); calendarMonth = new Date(year, month - 1 + delta, 1).toISOString().slice(0, 7); renderCalendar(); }
$('#prevMonth').onclick = () => moveMonth(-1); $('#nextMonth').onclick = () => moveMonth(1);
refresh(); renderCalendar();
