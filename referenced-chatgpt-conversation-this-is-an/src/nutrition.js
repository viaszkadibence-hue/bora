export const FOODS = {
  banan: { label: 'banán', aliases: ['banán', 'banan'], unitG: 118, kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3, uncertainty: 0.12 },
  alma: { label: 'alma', aliases: ['alma'], unitG: 182, kcal: 52, protein: 0.3, carbs: 13.8, fat: 0.2, uncertainty: 0.1 },
  tojás: { label: 'tojás', aliases: ['tojás', 'tojas'], unitG: 50, kcal: 143, protein: 12.6, carbs: 0.7, fat: 9.5, uncertainty: 0.15 },
  csirkemell: { label: 'csirkemell (sült, bőr nélkül)', aliases: ['csirkemell', 'csirke'], unitG: null, kcal: 165, protein: 31, carbs: 0, fat: 3.6, uncertainty: 0.2 },
  rizs: { label: 'rizs (főtt)', aliases: ['főtt rizs', 'rizs'], unitG: null, kcal: 130, protein: 2.7, carbs: 28.2, fat: 0.3, uncertainty: 0.15 },
  kenyér: { label: 'kenyér', aliases: ['kenyér', 'kenyer'], unitG: 35, kcal: 265, protein: 9, carbs: 49, fat: 3.2, uncertainty: 0.18 },
  görög_joghurt: { label: 'görög joghurt (natúr)', aliases: ['görög joghurt', 'görögjoghurt', 'joghurt'], unitG: null, kcal: 97, protein: 9, carbs: 3.9, fat: 5, uncertainty: 0.22 },
  zabpehely: { label: 'zabpehely', aliases: ['zabpehely', 'zab'], unitG: null, kcal: 389, protein: 16.9, carbs: 66.3, fat: 6.9, uncertainty: 0.1 },
  sajt: { label: 'sajt', aliases: ['sajt'], unitG: null, kcal: 350, protein: 25, carbs: 2, fat: 27, uncertainty: 0.35 },
  pizza: { label: 'pizza', aliases: ['pizza'], unitG: null, kcal: 266, protein: 11, carbs: 33, fat: 10, uncertainty: 0.4 }
};

const round = (n) => Math.round(n * 10) / 10;
const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const foodMatch = (text) => Object.values(FOODS).find((food) => food.aliases.some((a) => normalize(text).includes(normalize(a))));

export function estimateFood({ foodText, grams, quantity }) {
  const food = foodMatch(foodText);
  if (!food) return { status: 'clarify', message: `Nem találom biztosan, mi az a „${foodText}”. Írd le pontosabban (pl. márka/recept), vagy add meg a címkeértékeket.` };
  const effectiveGrams = grams ?? (quantity && food.unitG ? quantity * food.unitG : null);
  if (!effectiveGrams) return { status: 'clarify', message: `A(z) ${food.label} adagja hiányzik. Add meg grammban, vagy darabban, ha ez egyértelmű.` };
  const scale = effectiveGrams / 100;
  const macros = Object.fromEntries(['kcal', 'protein', 'carbs', 'fat'].map((key) => [key, round(food[key] * scale)]));
  const spread = Math.max(5, Math.round(macros.kcal * food.uncertainty));
  return { status: 'ok', food: food.label, grams: effectiveGrams, macros, kcalRange: [Math.max(0, Math.round(macros.kcal - spread)), Math.round(macros.kcal + spread)], confidence: food.uncertainty <= .15 ? 'közepes' : 'alacsony', note: food.uncertainty > .2 ? 'Az étel típusa/receptje erősen befolyásolhatja az értéket.' : 'Becslés tipikus tápértékek alapján.' };
}

export function parseMeal(text) {
  const grams = text.match(/(\d+(?:[,.]\d+)?)\s*g\b/i)?.[1]?.replace(',', '.');
  const quantity = text.match(/(\d+(?:[,.]\d+)?)\s*(db|darab)\b/i)?.[1]?.replace(',', '.');
  return estimateFood({ foodText: text, grams: grams && Number(grams), quantity: quantity && Number(quantity) });
}

export function formatEstimate(e) {
  if (e.status !== 'ok') return e.message;
  return `${e.food}, ${e.grams} g: kb. ${Math.round(e.macros.kcal)} kcal (${e.kcalRange[0]}–${e.kcalRange[1]} kcal), fehérje ${e.macros.protein} g, szénhidrát ${e.macros.carbs} g, zsír ${e.macros.fat} g. Bizonyosság: ${e.confidence}. ${e.note}`;
}
