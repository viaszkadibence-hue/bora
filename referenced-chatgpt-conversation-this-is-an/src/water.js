// Conservative, non-clinical daily total-water reference values in millilitres.
// They are guidance only: food, weather, exercise, illness and pregnancy can change needs.
export function waterGuidance(age, sex) {
  const years = Number(age);
  if (!Number.isFinite(years) || years < 1 || !sex) return null;
  if (years < 4) return { targetMl: 1300, label: '1–3 éves korosztály' };
  if (years < 9) return { targetMl: 1600, label: '4–8 éves korosztály' };
  if (years < 14) return { targetMl: sex === 'male' ? 2100 : 1900, label: '9–13 éves korosztály' };
  return { targetMl: sex === 'male' ? 2500 : 2000, label: '14+ korosztály' };
}
