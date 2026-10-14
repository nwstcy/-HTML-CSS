/* China Brand — интерактивный прототип: состояния экранов и переходы между ними.
   Генерация названий имитируется на клиенте (без настоящей нейросети). */
(() => {
  'use strict';

  /* ---------- Справочник сфер (как в макете + подкатегории) ---------- */
  const SPHERES = [
    { id: 'auto', name: 'Автомобили и транспорт', children: [
      { id: 'auto-cars', name: 'Автомобили', children: ['Легковые автомобили', 'Аксессуары для автомобилей', 'Автокосметика и уход за автомобилем', 'Шины и диски', 'Автозапчасти'] },
      { id: 'auto-personal', name: 'Личный транспорт', children: ['Велосипеды', 'Электросамокаты', 'Мотоциклы', 'Экипировка для райдеров'] },
      { id: 'auto-services', name: 'Транспортные услуги', children: ['Такси', 'Каршеринг', 'Грузоперевозки', 'Автосервис'] }
    ] },
    { id: 'home', name: 'Дом и бытовые товары', children: ['Мебель', 'Посуда и кухня', 'Текстиль для дома', 'Бытовая химия', 'Декор'] },
    { id: 'health', name: 'Здоровье', children: ['Аптеки', 'Клиники', 'Витамины и БАДы', 'Медицинская техника'] },
    { id: 'media', name: 'Медиа и развлечения', children: ['Кино и сериалы', 'Видеоигры', 'Издательства', 'Стриминг'] },
    { id: 'edu', name: 'Образование', children: ['Онлайн-школы', 'Языковые курсы', 'Детское развитие', 'Университеты'] },
    { id: 'sport', name: 'Спорт и активный отдых', children: ['Спортивная одежда и обувь', 'Фитнес-клубы', 'Туризм и снаряжение', 'Спортивное питание'] },
    { id: 'industry', name: 'Промышленность и строительство', children: ['Стройматериалы', 'Станки и оборудование', 'Девелопмент', 'Металлургия'] },
    { id: 'pets', name: 'Товары для животных', children: ['Корма', 'Ветеринария', 'Аксессуары для питомцев', 'Груминг'] },
    { id: 'business', name: 'Услуги для бизнеса', children: ['Консалтинг', 'Маркетинг и реклама', 'IT-аутсорсинг', 'Юридические услуги'] },
    { id: 'energy', name: 'Энергетика и топливо', children: ['Нефть и газ', 'Солнечная энергетика', 'АЗС', 'Электросети'] },
    { id: 'kids', name: 'Детские товары', children: ['Игрушки', 'Детская одежда', 'Товары для новорождённых', 'Детское питание'] },
    { id: 'food', name: 'Еда и напитки', children: ['Кофейни', 'Рестораны', 'Напитки', 'Кондитерские изделия', 'Фермерские продукты'] },
    { id: 'beauty', name: 'Красота и уход', children: ['Косметика', 'Парфюмерия', 'Салоны красоты', 'Уход за волосами'] },
    { id: 'music', name: 'Музыка и искусство', children: ['Музыкальные инструменты', 'Галереи', 'Концертные площадки', 'Лейблы'] },
    { id: 'fashion', name: 'Одежда и аксессуары', children: ['Женская одежда', 'Мужская одежда', 'Обувь', 'Ювелирные украшения', 'Сумки'] },
    { id: 'travel', name: 'Путешествия', children: ['Отели', 'Авиаперевозки', 'Турагентства', 'Сервисы бронирования'] },
    { id: 'tech', name: 'Техника и электроника', children: ['Смартфоны', 'Бытовая техника', 'Компьютеры', 'Умный дом'] },
    { id: 'trade', name: 'Торговля и доставка', children: ['Маркетплейсы', 'Курьерская доставка', 'Супермаркеты', 'Логистика'] },
    { id: 'finance', name: 'Финансы', children: ['Банки', 'Инвестиции', 'Страхование', 'Платёжные сервисы'] }
  ];

  /* Иероглифы со значением для «адаптации под сферу» */
  const MEANINGS = {
    auto: [['驰', 'chí', 'мчаться'], ['骏', 'jùn', 'быстрый скакун'], ['达', 'dá', 'достигать цели']],
    home: [['家', 'jiā', 'дом, семья'], ['安', 'ān', 'покой'], ['居', 'jū', 'жилище']],
    health: [['康', 'kāng', 'здоровье'], ['健', 'jiàn', 'крепкий'], ['安', 'ān', 'спокойствие']],
    media: [['影', 'yǐng', 'образ, кино'], ['乐', 'lè', 'радость'], ['星', 'xīng', 'звезда']],
    edu: [['学', 'xué', 'учёба'], ['智', 'zhì', 'мудрость'], ['博', 'bó', 'обширные знания']],
    sport: [['动', 'dòng', 'движение'], ['力', 'lì', 'сила'], ['跃', 'yuè', 'прыжок, рывок']],
    industry: [['建', 'jiàn', 'строить'], ['坚', 'jiān', 'прочный'], ['工', 'gōng', 'труд, мастерство']],
    pets: [['宠', 'chǒng', 'любимец'], ['爱', 'ài', 'любовь'], ['伴', 'bàn', 'спутник']],
    business: [['信', 'xìn', 'доверие'], ['联', 'lián', 'связь'], ['达', 'dá', 'достигать']],
    energy: [['能', 'néng', 'энергия'], ['源', 'yuán', 'источник'], ['光', 'guāng', 'свет']],
    kids: [['童', 'tóng', 'детство'], ['乐', 'lè', 'радость'], ['宝', 'bǎo', 'сокровище']],
    food: [['味', 'wèi', 'вкус'], ['鲜', 'xiān', 'свежесть'], ['香', 'xiāng', 'аромат']],
    beauty: [['美', 'měi', 'красота'], ['颜', 'yán', 'облик'], ['雅', 'yǎ', 'изящество']],
    music: [['艺', 'yì', 'искусство'], ['音', 'yīn', 'звук'], ['韵', 'yùn', 'гармония']],
    fashion: [['尚', 'shàng', 'мода'], ['衣', 'yī', 'одежда'], ['雅', 'yǎ', 'изящество']],
    travel: [['途', 'tú', 'путь'], ['游', 'yóu', 'путешествие'], ['行', 'xíng', 'идти вперёд']],
    tech: [['科', 'kē', 'наука'], ['智', 'zhì', 'интеллект'], ['电', 'diàn', 'электричество']],
    trade: [['通', 'tōng', 'проходить насквозь'], ['速', 'sù', 'скорость'], ['达', 'dá', 'доставлять']],
    finance: [['富', 'fù', 'богатство'], ['信', 'xìn', 'доверие'], ['银', 'yín', 'серебро']],
    custom: [['佳', 'jiā', 'прекрасный'], ['优', 'yōu', 'превосходный'], ['华', 'huá', 'блеск, расцвет']]
  };

  /* Устоявшиеся китайские названия известных брендов */
  const KNOWN = {
    bmw: { hanzi: '宝马', pinyin: 'bǎomǎ', text: '«宝马» означает драгоценный конь и естественно связывает марку с автомобилями; это также устоявшееся китайское название BMW.',
      sound: { hanzi: '比艾威', pinyin: 'bǐàiwēi', text: '«比艾威» передаёт названия букв B、M、W в сжатой китайской форме и сохраняет связь с автомобильным брендом.' } },
    apple: { hanzi: '苹果', pinyin: 'píngguǒ', text: '«苹果» дословно значит «яблоко»: это прямой перевод и официальное название Apple в Китае.' },
    nike: { hanzi: '耐克', pinyin: 'nàikè', text: '«耐克» звучит близко к оригиналу и читается как «выносливость» и «победа»: удачная пара для спортивного бренда.' },
    'coca-cola': { hanzi: '可口可乐', pinyin: 'kěkǒu kělè', text: '«可口可乐» значит «вкусно и радостно»: классический пример адаптации, которая сохранила звучание и добавила смысл.' },
    starbucks: { hanzi: '星巴克', pinyin: 'xīngbākè', text: '«星巴克» соединяет перевод слова star (星, «звезда») с транскрипцией bucks.' },
    ikea: { hanzi: '宜家', pinyin: 'yíjiā', text: '«宜家» значит «подходящий для дома»: смысл прямо поддерживает сферу мебели и товаров для дома.' },
    tesla: { hanzi: '特斯拉', pinyin: 'tèsīlā', text: '«特斯拉» — фонетическая передача фамилии Tesla; название официально используется в Китае.' },
    'mercedes-benz': { hanzi: '奔驰', pinyin: 'bēnchí', text: '«奔驰» значит «мчаться во весь опор» и передаёт звучание Benz.' },
    adidas: { hanzi: '阿迪达斯', pinyin: 'ādídásī', text: '«阿迪达斯» — фонетическая передача Adidas; иероглиф 达 добавляет оттенок «достижения».' },
    samsung: { hanzi: '三星', pinyin: 'sānxīng', text: '«三星» значит «три звезды» — это дословный перевод корейского названия Samsung.' }
  };

  /* Фонетическая таблица: согласная → [гласные a, e, i, o, u] */
  const SYLLABLES = {
    '': [['阿', 'ā'], ['埃', 'āi'], ['伊', 'yī'], ['欧', 'ōu'], ['乌', 'wū']],
    b: [['巴', 'bā'], ['贝', 'bèi'], ['比', 'bǐ'], ['博', 'bó'], ['布', 'bù']],
    c: [['卡', 'kǎ'], ['塞', 'sài'], ['西', 'xī'], ['科', 'kē'], ['库', 'kù']],
    d: [['达', 'dá'], ['德', 'dé'], ['迪', 'dí'], ['多', 'duō'], ['杜', 'dù']],
    f: [['法', 'fǎ'], ['菲', 'fēi'], ['菲', 'fēi'], ['佛', 'fó'], ['富', 'fù']],
    g: [['加', 'jiā'], ['格', 'gé'], ['吉', 'jí'], ['戈', 'gē'], ['古', 'gǔ']],
    h: [['哈', 'hā'], ['赫', 'hè'], ['希', 'xī'], ['霍', 'huò'], ['胡', 'hú']],
    j: [['佳', 'jiā'], ['杰', 'jié'], ['吉', 'jí'], ['乔', 'qiáo'], ['朱', 'zhū']],
    k: [['卡', 'kǎ'], ['凯', 'kǎi'], ['奇', 'qí'], ['科', 'kē'], ['酷', 'kù']],
    l: [['拉', 'lā'], ['雷', 'léi'], ['利', 'lì'], ['洛', 'luò'], ['路', 'lù']],
    m: [['马', 'mǎ'], ['美', 'měi'], ['米', 'mǐ'], ['莫', 'mò'], ['穆', 'mù']],
    n: [['纳', 'nà'], ['内', 'nèi'], ['尼', 'ní'], ['诺', 'nuò'], ['努', 'nǔ']],
    p: [['帕', 'pà'], ['佩', 'pèi'], ['皮', 'pí'], ['波', 'bō'], ['普', 'pǔ']],
    q: [['夸', 'kuā'], ['奎', 'kuí'], ['奇', 'qí'], ['阔', 'kuò'], ['库', 'kù']],
    r: [['拉', 'lā'], ['瑞', 'ruì'], ['里', 'lǐ'], ['罗', 'luó'], ['鲁', 'lǔ']],
    s: [['萨', 'sà'], ['塞', 'sài'], ['西', 'xī'], ['索', 'suǒ'], ['苏', 'sū']],
    t: [['塔', 'tǎ'], ['特', 'tè'], ['蒂', 'dì'], ['托', 'tuō'], ['图', 'tú']],
    v: [['瓦', 'wǎ'], ['维', 'wéi'], ['维', 'wéi'], ['沃', 'wò'], ['武', 'wǔ']],
    w: [['瓦', 'wǎ'], ['威', 'wēi'], ['维', 'wéi'], ['沃', 'wò'], ['乌', 'wū']],
    z: [['扎', 'zhā'], ['泽', 'zé'], ['齐', 'qí'], ['佐', 'zuǒ'], ['祖', 'zǔ']],
    S: [['夏', 'xià'], ['谢', 'xiè'], ['希', 'xī'], ['肖', 'xiāo'], ['舒', 'shū']],
    C: [['查', 'chá'], ['切', 'qiē'], ['奇', 'qí'], ['乔', 'qiáo'], ['楚', 'chǔ']]
  };
  const LONE = { b: ['布', 'bù'], c: ['克', 'kè'], d: ['德', 'dé'], f: ['夫', 'fū'], g: ['格', 'gé'], h: ['赫', 'hè'], j: ['杰', 'jié'], k: ['克', 'kè'], l: ['尔', 'ěr'], m: ['姆', 'mǔ'], n: ['恩', 'ēn'], p: ['普', 'pǔ'], q: ['克', 'kè'], r: ['尔', 'ěr'], s: ['斯', 'sī'], t: ['特', 'tè'], v: ['夫', 'fū'], w: ['沃', 'wò'], z: ['兹', 'zī'], S: ['什', 'shí'], C: ['奇', 'qí'] };
  const LETTERS = { A: ['艾', 'ài'], B: ['比', 'bǐ'], C: ['西', 'xī'], D: ['迪', 'dí'], E: ['伊', 'yī'], F: ['弗', 'fú'], G: ['吉', 'jí'], H: ['赫', 'hè'], I: ['爱', 'ài'], J: ['杰', 'jié'], K: ['凯', 'kǎi'], L: ['勒', 'lè'], M: ['艾', 'ài'], N: ['恩', 'ēn'], O: ['欧', 'ōu'], P: ['皮', 'pí'], Q: ['丘', 'qiū'], R: ['尔', 'ěr'], S: ['斯', 'sī'], T: ['提', 'tí'], U: ['优', 'yōu'], V: ['维', 'wéi'], W: ['威', 'wēi'], X: ['克', 'kè'], Y: ['怀', 'huái'], Z: ['泽', 'zé'] };
  const CYR = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
  const VOWELS = 'aeiou';

  const FREE_LIMIT = 3;
  const TYPE_DELAY = 2600;

  /* ---------- Генерация ---------- */
  function normalize(brand) {
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

  function generate(session, seed) {
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

  const canProcess = brand => /[A-Za-zА-Яа-яЁё]/.test(brand) && normalize(brand).length > 0;


  /* ---------- Состояние ---------- */
  const state = {
    sessions: [],
    current: null,
    step: 'brand',
    picker: { path: [], selected: null },
    generations: 0,
    busyTimer: null,
    seen: loadSeen(),
    modalAction: null
  };

  let uid = 0;
  const newSession = () => ({ id: ++uid, brand: '', sphere: '', sphereGroup: null, result: null, seed: 0, liked: false, inRecent: false });

  function loadSeen() {
    try { return JSON.parse(localStorage.getItem('cb-seen-tips') || '{}'); } catch { return {}; }
  }
  function markSeen(key) {
    state.seen[key] = true;
    try { localStorage.setItem('cb-seen-tips', JSON.stringify(state.seen)); } catch { /* приватный режим */ }
  }

  /* ---------- DOM ---------- */
  const $ = sel => document.querySelector(sel);
  const el = {
    dialog: $('#dialog'),
    scroll: $('#chat-scroll'),
    composer: $('#composer'),
    input: $('#composer-input'),
    alerts: $('#alert-slot'),
    applyBar: $('#apply-bar'),
    apply: $('#apply-sphere'),
    recent: $('#recent'),
    recentList: $('#recent-list'),
    favorites: $('#favorites'),
    favoritesList: $('#favorites-list'),
    sidebar: $('#sidebar'),
    backdrop: $('#sidebar-backdrop'),
    menuOpen: $('#menu-open'),
    modal: $('#modal'),
    toast: $('#toast'),
    newRequestWrap: $('.new-request-wrap')
  };

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (id, size = 20, extra = '') => `<svg class="icon icon--${size} ${extra}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const words = (text, delay = 0) => esc(text).split(/(\s+)/).map((w, i) => /^\s+$/.test(w) ? w : `<span class="word" style="--i:${i >> 1};--d:${delay}ms">${w}</span>`).join('');
  const hanzi = (text, delay = 0) => [...text].map((ch, i) => `<span class="hanzi-char" style="--i:${i};--d:${delay}ms">${esc(ch)}</span>`).join('');

  function li(className, html, role) {
    const node = document.createElement('li');
    node.className = `message ${className}`;
    if (role) node.dataset.role = role;
    node.innerHTML = html;
    el.dialog.append(node);
    return node;
  }

  function scrollToNode(node) {
    requestAnimationFrame(() => el.scroll.scrollTo({ top: Math.max(0, node.offsetTop - 24), behavior: 'smooth' }));
  }

  function scrollToEnd() {
    requestAnimationFrame(() => el.scroll.scrollTo({ top: el.scroll.scrollHeight, behavior: 'smooth' }));
  }

  /* Сфера, введённая вручную: ищем её в справочнике, чтобы подобрать смысловой иероглиф */
  function findGroup(name) {
    const needle = name.toLowerCase();
    if (needle.length < 3) return null;
    for (const top of SPHERES) {
      const stack = [top];
      while (stack.length) {
        const item = stack.pop();
        const title = (typeof item === 'string' ? item : item.name).toLowerCase();
        if (title.includes(needle) || needle.includes(title)) return top.id;
        if (item.children) stack.push(...item.children);
      }
    }
    return null;
  }

  /* Смена экрана с анимацией (View Transitions API, если поддерживается) */
  function transition(update) {
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(update);
    } else {
      update();
    }
  }

  function removeAnimated(node, cls = 'message--leaving') {
    if (!node) return Promise.resolve();
    return new Promise(resolve => {
      let finished = false;
      const done = () => { if (finished) return; finished = true; node.remove(); resolve(); };
      node.classList.add(cls);
      node.addEventListener('animationend', done, { once: true });
      setTimeout(done, 450);
    });
  }

  /* ---------- Поле ввода ---------- */
  const PLACEHOLDERS = {
    brand: 'Напишите название бренда, например: BMW',
    sphere: 'Или введите название сферы вручную',
    confirm: '',
    result: '',
    error: '',
    loading: ''
  };

  function setStep(step) {
    state.step = step;
    const next = PLACEHOLDERS[step];
    if (el.input.placeholder !== next) {
      el.composer.classList.add('composer--placeholder-swap');
      setTimeout(() => {
        el.input.placeholder = next;
        el.composer.classList.remove('composer--placeholder-swap');
      }, 160);
    }
    const busy = step === 'loading';
    el.composer.classList.toggle('composer--busy', busy);
    el.input.disabled = busy;
    $('#composer-send').setAttribute('aria-label', busy ? 'Остановить генерацию' : 'Отправить');
    el.applyBar.hidden = !(step === 'sphere' && state.picker.selected);
    updateReady();
  }

  function updateReady() {
    el.composer.classList.toggle('composer--ready', el.input.value.trim().length > 0 && state.step !== 'loading');
  }

  /* ---------- Подсказки ---------- */
  function tip(anchor, key, text, modifier, delay = 0) {
    if (state.seen[key] || !anchor) return null;
    const node = document.createElement('div');
    node.className = `tooltip tooltip--below tooltip--${modifier}`;
    node.setAttribute('role', 'note');
    node.dataset.tip = key;
    node.style.setProperty('--delay', `${delay}ms`);
    node.innerHTML = `<span>${esc(text)}</span><button class="tooltip__close" type="button" aria-label="Закрыть подсказку">${icon('close', 20)}</button>`;
    node.querySelector('.tooltip__close').addEventListener('click', event => { event.stopPropagation(); closeTip(key); });
    anchor.append(node);
    return node;
  }

  function closeTip(key) {
    markSeen(key);
    document.querySelectorAll(`[data-tip="${key}"]`).forEach(node => removeAnimated(node, 'tooltip--leaving'));
  }

  /* ---------- Уведомления ---------- */
  function showAlert(kind) {
    el.alerts.innerHTML = '';
    const node = document.createElement('div');
    node.setAttribute('role', 'alert');
    if (kind === 'mistake') {
      node.className = 'alert';
      node.innerHTML = `${icon('warning', 20, 'alert__icon')}<p class="alert__text">Название не удалось обработать, попробуйте снова</p>
        <span class="alert__retry"><button class="alert__link" type="button" data-alert="retry">Обновить</button>${icon('loop', 16)}</span>`;
    } else {
      node.className = 'alert alert--limit';
      node.innerHTML = `${icon('warning', 20, 'alert__icon')}<div class="alert__content">
          <div class="alert__texts"><p class="alert__title">Лимит генераций исчерпан</p><p class="alert__text">Вам необходимо продлить подписку</p></div>
          <div class="alert__actions">
            <button class="alert__link alert__link--underline" type="button" data-alert="renew">Обновить</button>
            <button class="alert__link" type="button" data-alert="plans">Узнать о тарифах</button>
          </div></div>`;
    }
    el.alerts.append(node);
  }

  function clearAlert() {
    const node = el.alerts.firstElementChild;
    if (node) removeAnimated(node, 'alert--leaving');
  }

  let toastTimer;
  function toast(text) {
    el.toast.textContent = text;
    el.toast.classList.add('toast--visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('toast--visible'), 2400);
  }

  /* ---------- Экран 1: приветствие и бренд ---------- */
  function renderIntro() {
    li('message--assistant', `
      <div class="intro__about"><div>
        <div class="intro">
          <div class="intro__block">
            <p class="message__text message__text--lead">${words('Привет! Я подберу китайское название для вашего бренда в три шага: с иероглифами, произношением и объяснением, почему оно подходит вашей сфере.')}</p>
            <div class="message__text">
              <p class="message__text">${words('Как это будет:', 300)}</p>
              <ol class="intro__steps">
                <li>${words('Вы называете бренд', 380)}</li>
                <li>${words('Выбираете сферу', 440)}</li>
                <li>${words('Я показываю результат: адаптацию под сферу и вариант по звучанию.', 500)}</li>
              </ol>
            </div>
          </div>
          <p class="message__text">${words('Понравившиеся названия можно сохранить в избранное.', 700)}</p>
        </div>
      </div></div>
      <h1 class="message__question">${words('Как называется ваш бренд?', 900)}</h1>`, 'intro');
  }

  function startNew({ prefill = '' } = {}) {
    clearTimeout(state.busyTimer);
    transition(() => {
      state.current = newSession();
      state.picker = { path: [], selected: null };
      el.dialog.innerHTML = '';
      el.alerts.innerHTML = '';
      renderIntro();
      setStep('brand');
      el.input.value = prefill;
      updateReady();
      renderHistory();
      el.scroll.scrollTop = 0;
    });
    closeDrawer();
    setTimeout(() => el.input.focus({ preventScroll: true }), 50);
  }

  function renderSphereQuestion(withPicker) {
    const node = li('message--assistant', `<h2 class="message__question">${withPicker ? words('В какой сфере работает бренд?') : 'В какой сфере работает бренд?'}</h2>${withPicker ? '<div class="sphere-picker"></div>' : ''}`, 'sphere-question');
    return node;
  }

  function submitBrand(text) {
    const session = state.current;
    session.brand = text;
    session.inRecent = true;
    state.sessions.unshift(session);
    renderHistory();

    const about = el.dialog.querySelector('.intro__about');
    if (about) about.classList.add('intro__about--hidden');

    li('message--user', `<p class="bubble">${esc(text)}</p>`);
    setTimeout(() => {
      const node = renderSphereQuestion(true);
      state.picker = { path: [], selected: null };
      renderPicker(node.querySelector('.sphere-picker'), 'forward');
      setStep('sphere');
      scrollToNode(node);
    }, 380);
  }

  /* ---------- Экран 2: выбор сферы ---------- */
  function currentLevel() {
    let items = SPHERES;
    for (const node of state.picker.path) items = node.children;
    return items;
  }

  function renderPicker(container, direction) {
    if (!container) return;
    const { path, selected } = state.picker;
    const items = currentLevel();
    const isLeaf = typeof items[0] === 'string';
    const crumbs = [{ name: 'Все сферы', depth: 0 }, ...path.map((p, i) => ({ name: p.name, depth: i + 1 }))];

    container.innerHTML = `
      <div class="sphere-picker__head">
        <ol class="breadcrumbs" aria-label="Путь по сферам">
          ${crumbs.map((c, i) => `<li class="breadcrumbs__item">${i ? icon('chevron-right', 16) : ''}${i < crumbs.length - 1
            ? `<button class="breadcrumbs__link" type="button" data-depth="${c.depth}">${esc(c.name)}</button>`
            : `<span aria-current="location">${esc(c.name)}</span>`}</li>`).join('')}
        </ol>
        <h3 class="sphere-picker__title">Выберите сферу</h3>
      </div>
      ${path.length ? `<button class="button button--soft button--back sphere-picker__back" type="button" data-back>${icon('back', 16)}Назад</button>` : ''}
      <ul class="sphere-grid sphere-grid--${direction}" style="--rows:${Math.ceil(items.length / 3)}" role="${isLeaf ? 'listbox' : 'list'}" aria-label="Сферы">
        ${items.map((item, i) => isLeaf
          ? `<li role="none"><button class="sphere-chip${selected === item ? ' sphere-chip--selected' : ''}" type="button" role="option" aria-selected="${selected === item}" data-leaf="${esc(item)}" style="--i:${i}">${esc(item)}</button></li>`
          : `<li><button class="sphere-chip" type="button" data-node="${i}" style="--i:${i}"><span>${esc(item.name)}</span>${icon('chevron-down')}</button></li>`).join('')}
      </ul>`;
    el.applyBar.hidden = !(state.step === 'sphere' && selected);
  }

  function onPickerClick(event) {
    const picker = event.target.closest('.sphere-picker');
    if (!picker || state.step !== 'sphere') return;
    const nodeBtn = event.target.closest('[data-node]');
    const leafBtn = event.target.closest('[data-leaf]');
    const crumb = event.target.closest('[data-depth]');
    const back = event.target.closest('[data-back]');

    if (nodeBtn) {
      state.picker.path.push(currentLevel()[Number(nodeBtn.dataset.node)]);
      state.picker.selected = null;
      renderPicker(picker, 'forward');
    } else if (leafBtn) {
      state.picker.selected = leafBtn.dataset.leaf;
      picker.querySelectorAll('[data-leaf]').forEach(b => {
        const on = b === leafBtn;
        b.classList.toggle('sphere-chip--selected', on);
        b.setAttribute('aria-selected', on);
      });
      el.applyBar.hidden = false;
    } else if (crumb) {
      state.picker.path = state.picker.path.slice(0, Number(crumb.dataset.depth));
      state.picker.selected = null;
      renderPicker(picker, 'back');
    } else if (back) {
      state.picker.path.pop();
      state.picker.selected = null;
      renderPicker(picker, 'back');
    }
  }

  async function chooseSphere(name, group) {
    const session = state.current;
    session.sphere = name;
    session.sphereGroup = group || 'custom';
    session.result = null;
    session.seed = 0;
    state.picker.selected = null;
    el.applyBar.hidden = true;
    renderHistory();
    setStep('confirm');

    const picker = el.dialog.querySelector('.sphere-picker');
    if (picker) await removeAnimated(picker);
    renderConfirmTail(session, true);
    scrollToEnd();
  }

  /* Редактирование: история диалога сохраняется, снова открывается выбор сферы */
  async function editSphere() {
    const session = state.current;
    closeTip('edit');
    document.querySelectorAll('[data-tip]').forEach(n => n.remove());
    clearAlert();
    const question = el.dialog.querySelector('[data-role="sphere-question"]');
    if (!question) return;

    const after = [];
    let next = question.nextElementSibling;
    while (next) { after.push(next); next = next.nextElementSibling; }
    await Promise.all(after.map(node => removeAnimated(node)));

    session.sphere = '';
    session.sphereGroup = null;
    session.result = null;
    renderHistory();

    const picker = document.createElement('div');
    picker.className = 'sphere-picker';
    question.append(picker);
    state.picker = { path: [], selected: null };
    setStep('sphere');
    renderPicker(picker, 'forward');
    scrollToNode(question);
  }

  /* ---------- Экран 3: подтверждение ---------- */
  function renderConfirmTail(session, withTips) {
    const user = li('message--user', `<p class="bubble">${esc(session.sphere)}</p>
      <div class="message__tools">
        <button class="tool-button" type="button" data-action="copy-request" aria-label="Скопировать запрос">${icon('copy', 16)}</button>
        <button class="tool-button" type="button" data-action="edit-request" aria-label="Изменить сферу">${icon('pencil', 16)}</button>
      </div>`);
    const brief = li('message--assistant', `
      <div class="brief">
        <p class="message__question">${words(`Бренд: ${session.brand}\nСфера: ${session.sphere}`, 150)}</p>
        <button class="button button--primary" type="button" data-action="generate">Адаптировать бренд</button>
      </div>`, 'brief');
    if (withTips) {
      tip(brief.querySelector('.brief'), 'confirm', 'Нажмите, если данные верны', 'confirm', 900);
      tip(user.querySelector('.message__tools'), 'edit', 'Можете отредактировать название бренда и сферу', 'edit', 1300);
    }
  }

  function renderConfirmScreen(session) {
    el.dialog.innerHTML = '';
    li('message--assistant', `<h2 class="message__question">Как называется ваш бренд?</h2>`);
    li('message--user', `<p class="bubble">${esc(session.brand)}</p>`);
    renderSphereQuestion(false);
    renderConfirmTail(session, false);
  }

  /* ---------- Экран 4: генерация ---------- */
  function generateResult() {
    const session = state.current;
    if (state.generations >= FREE_LIMIT) {
      showAlert('limit');
      return;
    }
    document.querySelectorAll('[data-tip]').forEach(n => n.remove());
    markSeen('confirm');
    clearAlert();

    transition(() => {
      el.dialog.innerHTML = '';
      li('message--assistant', `<p class="thinking__text">Подбираем адаптацию под сферу и звучание…</p>`);
      setStep('loading');
      el.scroll.scrollTop = 0;
    });

    clearTimeout(state.busyTimer);
    state.busyTimer = setTimeout(() => {
      if (!canProcess(session.brand)) {
        transition(() => { el.dialog.innerHTML = ''; setStep('error'); });
        showAlert('mistake');
        return;
      }
      state.generations += 1;
      session.result = generate(session, session.seed);
      transition(() => renderResult(session, true));
    }, TYPE_DELAY);
  }

  function stopGeneration() {
    clearTimeout(state.busyTimer);
    transition(() => {
      renderConfirmScreen(state.current);
      setStep('confirm');
    });
    toast('Генерация остановлена');
  }

  /* ---------- Экран 5: результат ---------- */
  function likeButton(session) {
    return `<button class="tool-button${session.liked ? ' tool-button--liked' : ''}" type="button" data-action="like" aria-pressed="${session.liked}" aria-label="${session.liked ? 'Убрать из «Моих брендов»' : 'Сохранить в «Мои бренды»'}">${icon(session.liked ? 'heart-fill' : 'heart')}</button>`;
  }

  function variantHtml(label, data, delay, withTools, session) {
    return `<section class="variant">
        <h3 class="variant__label">${label}</h3>
        <div class="variant__body">
          <p class="variant__hanzi" lang="zh-Hans" aria-label="${esc(data.hanzi)}">${hanzi(data.hanzi, delay)}</p>
          <div class="variant__texts">
            <p class="variant__pinyin">${words(data.pinyin, delay + 250)}</p>
            <p class="variant__meaning">${words(data.text, delay + 350)}</p>
          </div>
          ${withTools ? `<div class="message__tools variant__tools">
            ${likeButton(session)}
            <button class="tool-button" type="button" data-action="copy-result" aria-label="Скопировать результат">${icon('copy')}</button>
            <button class="tool-button" type="button" data-action="regenerate" aria-label="Сгенерировать другой вариант">${icon('loop')}</button>
          </div>` : ''}
        </div>
      </section>`;
  }

  function renderResult(session, withTips) {
    const { adaptation, sound } = session.result;
    el.dialog.innerHTML = '';
    const node = li('message--assistant', `
      <article class="adaptation">
        <h2 class="adaptation__title">${words(`Адаптация для ${session.brand}, ${session.sphere}`)}</h2>
        <div class="adaptation__variants">
          ${variantHtml('Адаптация с учётом сферы', adaptation, 200, false, session)}
          ${variantHtml('Вариант по звучанию', sound, 900, true, session)}
        </div>
      </article>`);
    setStep('result');
    renderHistory();
    el.scroll.scrollTop = 0;
    if (withTips) {
      tip(node.querySelector('.variant__tools'), 'save', 'Можете сохранить результат. Он появится слева в поле «Мои бренды»', 'save', 1900);
      tip(el.newRequestWrap, 'sidebar', 'Нажмите «Новый запрос», чтобы адаптировать другой бренд', 'sidebar', 2600);
    }
  }

  function openSession(id) {
    const session = state.sessions.find(s => s.id === id);
    if (!session) return;
    clearTimeout(state.busyTimer);
    closeDrawer();
    transition(() => {
      state.current = session;
      el.alerts.innerHTML = '';
      if (session.result) {
        renderResult(session, false);
      } else if (session.sphere) {
        renderConfirmScreen(session);
        setStep('confirm');
      } else {
        el.dialog.innerHTML = '';
        li('message--assistant', `<h2 class="message__question">Как называется ваш бренд?</h2>`);
        li('message--user', `<p class="bubble">${esc(session.brand)}</p>`);
        const q = renderSphereQuestion(true);
        state.picker = { path: [], selected: null };
        setStep('sphere');
        renderPicker(q.querySelector('.sphere-picker'), 'forward');
      }
      renderHistory();
    });
  }

  /* ---------- История и «Мои бренды» ---------- */
  const label = s => s.sphere ? `${s.brand}, ${s.sphere}` : s.brand;

  function renderHistory() {
    const recent = state.sessions.filter(s => s.inRecent);
    const liked = state.sessions.filter(s => s.liked && s.result);
    const shown = new Set([...el.recentList.children, ...el.favoritesList.children].map(n => n.dataset.key));
    const item = (s, list, withDelete) => {
      const key = `${list}-${s.id}`;
      return `<li class="history__item${s === state.current && list === 'recent' ? ' history__item--active' : ''}${shown.has(key) ? ' history__item--static' : ''}" data-id="${s.id}" data-key="${key}">
        <button class="history__link" type="button" data-open="${s.id}" title="${esc(label(s))}">${esc(label(s))}</button>
        ${withDelete ? `<button class="history__delete" type="button" data-delete="${s.id}" aria-label="Удалить «${esc(label(s))}» из истории">${icon('trash')}</button>` : ''}
      </li>`;
    };

    el.recentList.innerHTML = recent.map(s => item(s, 'recent', true)).join('');
    el.favoritesList.innerHTML = liked.map(s => item(s, 'fav', false)).join('');
    el.recent.hidden = recent.length === 0;
    el.favorites.hidden = liked.length === 0;
    el.sidebar.classList.toggle('sidebar--empty', recent.length === 0 && liked.length === 0);
  }

  function askDelete(id) {
    openModal({
      title: 'Хотите удалить?',
      text: 'Адаптация бренда будет удалена из истории. В «Моих брендах» она останется.',
      confirm: 'Удалить',
      danger: true,
      onConfirm: async () => {
        const session = state.sessions.find(s => s.id === id);
        if (!session) return;
        await removeAnimated(el.recentList.querySelector(`[data-id="${id}"]`), 'history__item--leaving');
        session.inRecent = false;
        if (!session.liked || !session.result) state.sessions = state.sessions.filter(s => s !== session);
        renderHistory();
        if (session === state.current) startNew();
      }
    });
  }

  /* ---------- Модальное окно ---------- */
  function openModal({ title, text, confirm, danger = false, onConfirm }) {
    $('#modal-title').textContent = title;
    $('#modal-text').textContent = text;
    const btn = $('#modal-confirm');
    btn.textContent = confirm;
    btn.className = `button ${danger ? 'button--danger' : 'button--primary'}`;
    state.modalAction = onConfirm;
    el.modal.hidden = false;
    el.modal.classList.remove('modal--closing');
    btn.focus();
  }

  function closeModal() {
    if (el.modal.hidden) return;
    el.modal.classList.add('modal--closing');
    setTimeout(() => { el.modal.hidden = true; el.modal.classList.remove('modal--closing'); }, 180);
  }

  /* ---------- Мобильное меню ---------- */
  function openDrawer() {
    el.sidebar.classList.add('sidebar--open');
    el.backdrop.hidden = false;
    el.menuOpen.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    el.sidebar.classList.remove('sidebar--open');
    el.backdrop.hidden = true;
    el.menuOpen.setAttribute('aria-expanded', 'false');
  }

  /* ---------- Буфер обмена ---------- */
  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast('Скопировано');
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      document.body.append(area);
      area.select();
      try { document.execCommand('copy'); toast('Скопировано'); } catch { toast('Не удалось скопировать'); }
      area.remove();
    }
  }

  /* ---------- Обработчики ---------- */
  el.input.addEventListener('input', updateReady);

  el.composer.addEventListener('submit', event => {
    event.preventDefault();
    if (state.step === 'loading') { stopGeneration(); return; }
    const text = el.input.value.trim();
    if (!text) { el.input.focus(); return; }
    el.input.value = '';
    updateReady();
    clearAlert();

    if (state.step === 'brand') submitBrand(text);
    else if (state.step === 'sphere') chooseSphere(text.charAt(0).toUpperCase() + text.slice(1), state.picker.path[0]?.id || findGroup(text));
    else {
      startNew();
      setTimeout(() => submitBrand(text), 420);
    }
  });

  el.apply.addEventListener('click', () => {
    if (state.picker.selected) chooseSphere(state.picker.selected, state.picker.path[0]?.id);
  });

  el.dialog.addEventListener('click', event => {
    onPickerClick(event);
    const button = event.target.closest('[data-action]');
    const action = button?.dataset.action;
    const session = state.current;
    if (!action || !session) return;

    if (action === 'generate') generateResult();
    if (action === 'copy-request') copy(`${session.brand}, ${session.sphere}`);
    if (action === 'edit-request') editSphere();
    if (action === 'copy-result') {
      const { adaptation, sound } = session.result;
      copy(`${session.brand} → ${adaptation.hanzi} (${adaptation.pinyin}); по звучанию: ${sound.hanzi} (${sound.pinyin})`);
    }
    if (action === 'like') {
      closeTip('save');
      session.liked = !session.liked;
      button.outerHTML = likeButton(session);
      if (!session.liked && !session.inRecent) state.sessions = state.sessions.filter(s => s !== session);
      renderHistory();
    }
    if (action === 'regenerate') {
      button.classList.add('tool-button--spin');
      session.seed += 1;
      generateResult();
    }
  });

  el.alerts.addEventListener('click', event => {
    const kind = event.target.closest('[data-alert]')?.dataset.alert;
    if (kind === 'retry') {
      const brand = state.current?.brand || '';
      if (state.current) { state.current.inRecent = false; state.sessions = state.sessions.filter(s => s !== state.current); }
      startNew({ prefill: brand });
    }
    if (kind === 'renew') renewPlan();
    if (kind === 'plans') showPlans();
  });

  function renewPlan() {
    state.generations = 0;
    clearAlert();
    toast(`Подписка продлена: доступно ${FREE_LIMIT} генерации`);
  }

  function showPlans() {
    openModal({
      title: 'Тарифы China Brand',
      text: `Бесплатно — ${FREE_LIMIT} адаптации. Pro — без ограничений.`,
      confirm: 'Подключить Pro',
      onConfirm: renewPlan
    });
  }

  $('#new-request').addEventListener('click', () => { closeTip('sidebar'); startNew(); });
  $('#topbar-new').addEventListener('click', () => startNew());
  $('#logo').addEventListener('click', event => { event.preventDefault(); startNew(); });
  $('#plan-button').addEventListener('click', showPlans);

  document.querySelector('.history').addEventListener('click', event => {
    const open = event.target.closest('[data-open]');
    const del = event.target.closest('[data-delete]');
    if (del) askDelete(Number(del.dataset.delete));
    else if (open) openSession(Number(open.dataset.open));
  });

  el.menuOpen.addEventListener('click', openDrawer);
  $('#sidebar-close').addEventListener('click', closeDrawer);
  el.backdrop.addEventListener('click', closeDrawer);

  el.modal.addEventListener('click', event => {
    if (event.target.closest('[data-close-modal]')) closeModal();
  });
  $('#modal-confirm').addEventListener('click', () => {
    const action = state.modalAction;
    closeModal();
    if (action) action();
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!el.modal.hidden) closeModal();
    else closeDrawer();
  });

  /* ---------- Старт: первый экран макета ---------- */
  state.current = newSession();
  renderIntro();
  setStep('brand');
  renderHistory();
})();
