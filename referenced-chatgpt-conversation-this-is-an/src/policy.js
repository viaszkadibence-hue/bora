export function validateProfile(profile = {}) {
  const age = Number(profile.age);
  const target = Number(profile.dailyTarget);
  if (Number.isFinite(age) && age < 18 && Number.isFinite(target) && target > 0 && target < 1600) {
    return { allowed: false, message: 'Kiskorúaknál nem támogatunk veszélyesen alacsony kalóriacélt. Beszélj szülővel/gondviselővel és gyermekorvossal vagy dietetikussal személyre szabott célról.' };
  }
  if (Number.isFinite(target) && target > 0 && target < 1200) return { allowed: false, message: '1200 kcal alatti célhoz nem adunk automatikus tervet. Egyeztess egészségügyi szakemberrel.' };
  return { allowed: true };
}

export function safeReply(text, profile) {
  const check = validateProfile(profile);
  if (!check.allowed) return check;
  if (/fogy|diéta|diet|kalóriacél|kaloria cel/i.test(text) && Number(profile?.age) < 18) {
    return { allowed: false, message: 'Kiskorúaknál nem adok fogyókúrás vagy kalóriakorlátozó tanácsot. Biztonságosabb, ha ezt gondviselővel és szakemberrel beszélitek meg.' };
  }
  return { allowed: true };
}
