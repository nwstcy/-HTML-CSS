/* Подбор китайского названия: транслитерация по слогам и иероглиф по смыслу сферы.
   Настоящей нейросети нет — результат имитируется на клиенте. */
import { MEANINGS, KNOWN, SYLLABLES, LONE, LETTERS, CYR, VOWELS } from './data.js';

/* ---------- Генерация ---------- */
export function normalize(brand) {
  let s = brand.toLowerCase().replace(/[а-яё]/g, ch => CYR[ch] ?? '');
  s = s.replace(/sch/g, 'S').replace(/sh/g, 'S').replace(/tch/g, 'C').replace(/ch/g, 'C')
    .replace(/ph/g, 'f').replace(/th/g, 't').replace(/ck/g, 'k').replace(/qu/g, 'kw')
    .replace(/x/g, 'ks').replace(/ee/g, 'i').replace(/oo/g, 'u').replace(/y/g, 'i')
    .replace(/[^a-zSC]/g, '');
  return s;
}

function phonetic(brand) {
  const raw = brand.replace(/[^A-Za-zА-Яа-яЁё]/g, '');
  const isAcronym = raw.length > 1 && raw.length <= 4 && raw === raw.toUpperCase() && /^[A-Z]+$/.test(raw);
  if (isAcronym) return raw.split('').map(l => LETTERS[l]);

  const s = normalize(brand);
  const parts = s.match(/[^aeiou]*[aeiou]+|[^aeiou]+$/g) || [];
  const out = [];
  for (const part of parts) {
    if (out.length >= 4) break;
    const cons = part.match(/^[^aeiou]*/)[0];
    const vowel = part.slice(cons.length)[0];
    if (!vowel) { if (LONE[cons[0]]) out.push(LONE[cons[0]]); continue; }
    if (cons.length > 1 && out.length < 3 && LONE[cons[0]] && cons[0] !== cons[1]) out.push(LONE[cons[0]]);
    const key = cons ? cons[cons.length - 1] : '';
    const row = SYLLABLES[key] || SYLLABLES[''];
    out.push(row[VOWELS.indexOf(vowel)]);
  }
  return out.slice(0, 4);
}

const joinPinyin = list => list.map(x => x[1]).join('');
const joinHanzi = list => list.map(x => x[0]).join('');

export function generate(session, seed) {
  const brandKey = session.brand.trim().toLowerCase().replace(/\s+/g, '-');
  const known = KNOWN[brandKey];
  const sounds = phonetic(session.brand);
  const sound = known && known.sound ? known.sound : {
    hanzi: joinHanzi(sounds),
    pinyin: joinPinyin(sounds),
    text: `«${joinHanzi(sounds)}» передаёт звучание названия ${session.brand} слогами ${sounds.map(x => x[0]).join('、')} и сохраняет узнаваемость бренда при произношении.`
  };

  let adaptation;
  if (known && seed === 0) {
    adaptation = { hanzi: known.hanzi, pinyin: known.pinyin, text: known.text };
  } else {
    const list = MEANINGS[session.sphereGroup] || MEANINGS.custom;
    const meaning = list[seed % list.length];
    const head = sounds.slice(0, seed % 2 === 1 && sounds.length > 2 ? 2 : 1)
      .filter(x => x[0] !== meaning[0]);
    const chars = [...head, meaning];
    adaptation = {
      hanzi: joinHanzi(chars),
      pinyin: joinPinyin(chars),
      text: `«${joinHanzi(chars)}» сочетает звучание начала названия ${session.brand} (${joinHanzi(head)} ${joinPinyin(head)}) и иероглиф «${meaning[0]}» — «${meaning[2]}», который поддерживает сферу «${session.sphere}».`
    };
  }
  return { adaptation, sound };
}

export const canProcess = brand => /[A-Za-zА-Яа-яЁё]/.test(brand) && normalize(brand).length > 0;
