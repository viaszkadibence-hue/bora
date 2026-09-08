export const WORKOUT_TYPES = {
  strength: { label: 'Erő', icon: '◆', defaultMinutes: 45 },
  cardio: { label: 'Kardió', icon: '↗', defaultMinutes: 30 },
  mobility: { label: 'Mobilitás', icon: '○', defaultMinutes: 15 },
  sport: { label: 'Sport', icon: '✦', defaultMinutes: 60 }
};

export function workoutSuggestion(profile = {}, workoutsToday = []) {
  if (workoutsToday.length) return { title: 'Edzés rögzítve', detail: 'A mai mozgás már a naplódban van. Figyelj a pihenésre és a folyadékra.', type: 'recovery' };
  const focus = profile.trainingGoal || 'strength';
  const choices = {
    strength: { title: 'Teljes testes alap', detail: 'Válassz 4 alapgyakorlatot, 2–3 kényelmes sorozattal. A jó technika fontosabb a súlynál.', type: 'strength' },
    endurance: { title: 'Zóna 2 séta vagy bicikli', detail: '20–30 perc olyan tempóban, ahol még rövid mondatokban tudsz beszélni.', type: 'cardio' },
    mobility: { title: 'Mozgásminőség blokk', detail: '15 perc könnyű mobilitás: csípő, váll és gerinc. Fájdalomig ne erőltesd.', type: 'mobility' },
    general: { title: 'Mozgás-snack', detail: 'Egy 15 perces könnyű séta vagy nyújtás is számít. A ritmus a lényeg.', type: 'mobility' }
  };
  return choices[focus] ?? choices.general;
}

export function momentum({ summary, water, waterGuide, workouts, performance, goal }) {
  const fuel = goal?.dailyTarget && summary.count ? Math.min(40, Math.round(40 * Math.min(summary.totals.kcal / goal.dailyTarget, 1))) : (summary.count ? 20 : 0);
  const hydration = waterGuide ? Math.min(20, Math.round(20 * Math.min(water.amountMl / waterGuide.targetMl, 1))) : (water.amountMl ? 8 : 0);
  const training = workouts.length ? 25 : 0;
  const consistency = Math.min(15, Math.round(performance.loggedDays / 7 * 15));
  const score = fuel + hydration + training + consistency;
  const next = !summary.count ? 'Rögzíts egy étkezést vagy egy snacket.' : !workouts.length ? 'Tervezz ma egy rövid, kényelmes mozgásblokkot.' : waterGuide && water.amountMl < waterGuide.targetMl * .6 ? 'Kortyolj vizet a következő pihenődben.' : 'Megvan a mai alap. Tartsd fenn a ritmust!';
  return { score, components: { fuel, hydration, training, consistency }, next, label: score >= 75 ? 'Lendületben' : score >= 40 ? 'Épülő ritmus' : 'Indító lépés' };
}
