document.querySelector('.scroll-hint').addEventListener('click', function() {
  const target = document.getElementById('section11');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
});

const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

const video = document.getElementById('heroVideo');
const canvas = document.getElementById('bokehCanvas');
function spawnOrbs() {
    const colors = ['rgba(220,220,220,VAR)','rgba(240,240,240,VAR)','rgba(200,200,200,VAR)','rgba(255,255,255,VAR)','rgba(230,230,230,VAR)'];
    for (let i = 0; i < 18; i++) {
        const orb = document.createElement('div'); orb.className = 'bokeh-orb';
        const size = 60 + Math.random() * 180, op = (.15 + Math.random() * .25).toFixed(2);
        const color = colors[Math.floor(Math.random() * colors.length)].replace('VAR', op);
        orb.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${10+Math.random()*80}%;background:${color};--dur:${7+Math.random()*8}s;--delay:${-Math.random()*10}s;--op:${op};`;
        canvas.appendChild(orb);
    }
}
spawnOrbs();
video.addEventListener('error', () => { canvas.style.opacity = '1'; });
video.addEventListener('playing', () => { canvas.style.opacity = '0'; canvas.style.transition = 'opacity 1s'; });

// Force autoplay for background video
function forceVideoPlay() {
    if (video.paused) {
        video.play().catch(() => {
            // Autoplay blocked — retry on first user interaction
            document.addEventListener('click', () => { video.play(); }, { once: true });
            document.addEventListener('touchstart', () => { video.play(); }, { once: true });
        });
    }
}
video.addEventListener('canplay', forceVideoPlay);
forceVideoPlay();

const unlockScreen = document.getElementById('unlock-screen');
const unlockBtn = document.getElementById('unlockBtn');
const musicToggleUnlock = document.getElementById('musicToggleUnlock');
const langBtns = document.querySelectorAll('.lang-btn');


// ========== МУЗЫКАЛЬНЫЙ ПЛЕЕР ==========
(function() {
    // Создаём аудио элемент
    const bgMusic = new Audio('music123.mp3'); // Убедитесь, что файл music.mp3 существует в той же папке
    bgMusic.loop = true; // Зацикливаем музыку
    bgMusic.volume = 0.5; // Громкость 50% (можно изменить)
    
    let isMusicPlaying = false; // Флаг состояния музыки
    
    // Кнопка музыки на unlock-экране
    const musicToggleUnlock = document.getElementById('musicToggleUnlock');
    
    // Может быть ещё одна кнопка на основном экране (если есть)
    const musicToggleMain = document.getElementById('musicToggleMain'); // Если есть такая кнопка на основном экране
    
    // Функция для обновления иконки кнопки
    function updateMusicIcon(button, isPlaying) {
        if (!button) return;
        
        // Сохраняем текущий SVG
        const svg = button.querySelector('svg');
        if (!svg) return;
        
        if (isPlaying) {
            // Иконка "Включено" (динамик со звуком)
            svg.innerHTML = `
                <path d="M3 10v4h4l5 5V5l-5 5H3z"/>
                <path d="M18 8c1.5 1.5 2 3.5 2 6s-0.5 4.5-2 6"/>
                <path d="M21 5c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9"/>
            `;
        } else {
            // Иконка "Выключено" (динамик с крестиком)
            svg.innerHTML = `
                <path d="M3 10v4h4l5 5V5l-5 5H3z"/>
                <line x1="18" y1="8" x2="22" y2="12"/>
                <line x1="22" y1="8" x2="18" y2="12"/>
            `;
        }
    }
    
    // Функция для включения музыки
    function playMusic() {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            updateMusicIcon(musicToggleUnlock, true);
            if (musicToggleMain) updateMusicIcon(musicToggleMain, true);
        }).catch(error => {
            console.log('Автовоспроизведение заблокировано браузером. Нужно взаимодействие пользователя:', error);
        });
    }
    
    // Функция для выключения музыки
    function pauseMusic() {
        bgMusic.pause();
        isMusicPlaying = false;
        updateMusicIcon(musicToggleUnlock, false);
        if (musicToggleMain) updateMusicIcon(musicToggleMain, false);
    }
    
    // Переключение музыки
    function toggleMusic() {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }
    
    // Вешаем обработчик на кнопку разблокировки
    if (musicToggleUnlock) {
        musicToggleUnlock.addEventListener('click', (e) => {
            e.stopPropagation(); // Чтобы не триггерить другие события
            toggleMusic();
        });
    }
    
    // Если есть кнопка на основном экране
    if (musicToggleMain) {
        musicToggleMain.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }
    
    // Пробуем включить музыку при разблокировке (после клика пользователя)
    const unlockBtnForMusic = document.getElementById('unlockBtn');
    if (unlockBtnForMusic) {
        unlockBtnForMusic.addEventListener('click', () => {
            // Небольшая задержка, чтобы звук разблокировки не конфликтовал
            setTimeout(() => {
                if (!isMusicPlaying) {
                    playMusic();
                }
            }, 500);
        });
    }
    
    // Также пробуем включить при первом любом взаимодействии (на случай, если unlockBtn не сработал)
    const anyInteraction = () => {
        if (!isMusicPlaying) {
            playMusic();
        }
        // Удаляем обработчики после первого взаимодействия
        document.removeEventListener('click', anyInteraction);
        document.removeEventListener('touchstart', anyInteraction);
    };
    
    document.addEventListener('click', anyInteraction);
    document.addEventListener('touchstart', anyInteraction);
})();



unlockBtn.addEventListener('click', () => {
    unlockBtn.style.transform = "scale(0.92)";
    setTimeout(() => { unlockBtn.style.transform = ""; }, 120);
    unlockScreen.classList.add('opening');
    unlockScreen.querySelector('.unlock-center').classList.add('unlock-opening');
    
    
    setTimeout(() => {
        unlockScreen.classList.add('hidden');
        document.body.classList.remove('overflowH');
        document.body.classList.add('loaded');
        loadGuestsFromDB();
    }, 1200);
});

// ========== MEHMONLAR (localStorage) ==========

function loadGuestsFromDB() {
    const guests = getGuestsFromStorage();
    renderGuestsTable(guests);
    updateStatsFromGuestsData(guests);
}

function getGuestsFromStorage() {
    try {
        return JSON.parse(localStorage.getItem('wedding_guests') || '[]');
    } catch(e) { return []; }
}

function saveGuestToStorage(data) {
    const guests = getGuestsFromStorage();
    guests.push({
        name: data.name,
        guestCount: data.guestCount || 1,
        attendance: data.attendance,
        comment: data.comment || '',
        time: new Date().toLocaleString('ru-RU')
    });
    localStorage.setItem('wedding_guests', JSON.stringify(guests));
}

function renderGuestsTable(guests) {
    const tbody = document.getElementById('guestsTableBody');
    if (!tbody) return;
    
    if (!guests || guests.length === 0) {
        const emptyMsg = { uz: 'Hech qanday mehmon topilmadi', uzk: 'Ҳеч қандай меҳмон топилмади', ru: 'Гостей пока нет', en: 'No guests found' };
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6">${emptyMsg[currentLang] || emptyMsg.uz}</td></tr>`;
        return;
    }
    
    let html = '';
    
    guests.forEach((guest, index) => {
        let statusClass = '';
        let statusText = '';
        const att = guest.attendance || guest.status || '';
        
        const statusLabels = {
            uz:  { yes: 'Tasdiqlangan ✓', no: 'Kela olmaydi ✗', other: 'Javob berdi' },
            uzk: { yes: 'Тасдиқланди ✓', no: 'Кела олмайди ✗', other: 'Жавоб берди' },
            ru:  { yes: 'Подтверждён ✓', no: 'Не придёт ✗', other: 'Ответил' },
            en:  { yes: 'Confirmed ✓', no: 'Declined ✗', other: 'Responded' }
        };
        const sl = statusLabels[currentLang] || statusLabels.uz;
        if (att === 'yes' || att === 'confirmed') {
            statusText = sl.yes;
            statusClass = 'status-confirmed';
        } else if (att === 'no' || att === 'declined') {
            statusText = sl.no;
            statusClass = 'status-declined';
        } else {
            statusText = sl.other;
            statusClass = 'status-pending';
        }
        
        const statusBadge = `<span class="status-badge ${statusClass}">${statusText}</span>`;
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(guest.name || '—')}</strong></td>
                <td>${statusBadge}</td>
                <td>${escapeHtml(guest.comment || '—')}</td>
                <td class="time-cell">${guest.time || '—'}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function updateStatsFromGuestsData(guests) {
    let total = 0;
    let confirmed = 0;
    let declined = 0;
    
    guests.forEach(guest => {
        total += 1;
        const att = guest.attendance || guest.status || '';
        if (att === 'yes' || att === 'confirmed') confirmed += 1;
        else if (att === 'no' || att === 'declined') declined += 1;
    });
    
    const totalEl = document.getElementById('totalGuests');
    const confirmedEl = document.getElementById('confirmedCount');
    const declinedEl = document.getElementById('declinedCount');
    
    if (totalEl) totalEl.textContent = total;
    if (confirmedEl) confirmedEl.textContent = confirmed;
    if (declinedEl) declinedEl.textContent = declined;
}

function resetStatsToZero() {
    const totalEl = document.getElementById('totalGuests');
    const confirmedEl = document.getElementById('confirmedCount');
    const declinedEl = document.getElementById('declinedCount');
    
    if (totalEl) totalEl.textContent = '0';
    if (confirmedEl) confirmedEl.textContent = '0';
    if (declinedEl) declinedEl.textContent = '0';
}

function escapeHtml(str) {
    if (!str) return "—";
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ========== GUEST SELECTOR ==========
(function() {
    const guestCountSpan = document.querySelector('.guest-count');
    const minusBtn = document.querySelector('.guest-minus');
    const plusBtn = document.querySelector('.guest-plus');
    let count = 1;
    const max = 5;
    const min = 1;

    if (minusBtn && plusBtn && guestCountSpan) {
        minusBtn.addEventListener('click', () => {
            if (count > min) {
                count--;
                guestCountSpan.textContent = count;
            }
        });

        plusBtn.addEventListener('click', () => {
            if (count < max) {
                count++;
                guestCountSpan.textContent = count;
            }
        });
    }
})();

// ========== DUAL TIMERS ==========
function updateTimer(targetDate, suffix) {
    const now = new Date();
    const diff = targetDate - now;
    const set = (id, val) => { const el = document.getElementById(id + suffix); if (el) el.innerHTML = val; };
    if (diff <= 0) {
        set('days', '0'); set('hours', '00'); set('minutes', '00'); set('seconds', '00');
        return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    set('days', d);
    set('hours', h < 10 ? '0' + h : h);
    set('minutes', m < 10 ? '0' + m : m);
    set('seconds', s < 10 ? '0' + s : s);
}

function updateAllTimers() {
    updateTimer(new Date(2026, 5, 13, 11, 0, 0), '1'); // June 13 kelin
    updateTimer(new Date(2026, 5, 21, 5, 0, 0), '2');  // June 21 kuyov
}

updateAllTimers();
setInterval(updateAllTimers, 1000);

// ========== SHARE FUNCTIONALITY ==========
(function() {
    const currentUrl = window.location.href;
    
    const telegramBtn = document.getElementById('telegramShare');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}`;
            window.open(telegramUrl, '_blank', 'noopener,noreferrer');
        });
    }
    
    const whatsappBtn = document.getElementById('whatsappShare');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(currentUrl)}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        });
    }
    
    const copyBtn = document.getElementById('copyLinkBtn');
    const copyNote = document.getElementById('copyNote');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(currentUrl);
                copyNote.classList.add('show');
                setTimeout(() => {
                    copyNote.classList.remove('show');
                }, 2500);
            } catch (err) {
                console.error('Nusxa olishda xatolik:', err);
                const textarea = document.createElement('textarea');
                textarea.value = currentUrl;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                copyNote.classList.add('show');
                setTimeout(() => {
                    copyNote.classList.remove('show');
                }, 2500);
            }
        });
    }
})();

// ========== LANGUAGE TRANSLATIONS ==========
let currentLang = 'uz';

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.getAttribute('data-lang');
        currentLang = lang;
        
        const translations = {
            ru: { 
                title: 'ВЫ ПОЛУЧИЛИ ПРИГЛАШЕНИЕ', 
                instruction: 'Нажмите на замок,', 
                instruction1: 'чтобы открыть приглашение',
                heros1: 'Приглашение на свадьбу',
                heros2: '13 июня & 21 июня 2026',
                herodate: 'Ваше присутствие — самый дорогой подарок для нас',
                timerlabel1: 'ДО СВАДЬБЫ НЕВЕСТЫ',
                timerlabel2: 'ДО СВАДЬБЫ ЖЕНИХА',
                timerside1: 'Сторона невесты',
                timerside2: 'Сторона жениха',
                unit11: 'дней',
                unit22: 'часов',
                unit33: 'минут',
                unit44: 'секунд',
                scroll11: 'листайте вниз',
                tag11: 'Дорогие гости!',
                quote11: 'Мы хотим отпраздновать этот дорогой для нас день вместе с вами. Будем искренне рады, если вы разделите с нами нашу радость.',
                cal11: 'СЧИТАННЫЕ ДНИ',
                cal22: 'Свадебный календарь',
                cal33: 'ИЮНЬ 2026',
                cale1: 'Пн',
                cale2: 'Вт',
                cale3: 'Ср',
                cale4: 'Чт',
                cale5: 'Пт',
                cale6: 'Сб',
                cale7: 'Вс',
                notetext1: 'сердце — день свадьбы',
                detcd1: 'Кратко о нашей свадьбе',
                detcd2: 'Детали мероприятия',
                detcd3: 'Место проведения',
                detcd4: 'Ресторан «SARBON», Фергана, улица Фергана, 27б',
                detcd5: 'Открыть на карте →',
                detcd6: 'Программа свадьбы',
                 detcd22: 'Места проведения',
                 detcd23: '«QANDAK» свадебный дом, Риштанский район',
                'detcd-side1': 'Сторона невесты',
                'detcd-side2': 'Сторона жениха',
                detcd7: '21 июня 2026',
                detcd24: '13 июня 2026',
                detcd8: '05:00 — Утренний плов',
                detcd8b: '17:00 — Свадебный банкет',
                detcd25: '11:00 — Свадебный банкет (для стороны невесты)',
                detcd9: 'Дресс-код',
                detcd10: 'Официальный, предпочтительны светлые тона',
                detcd11: 'Формат',
                detcd12: 'Халяль. Торжественное мероприятие проводится без алкогольных напитков',
                detcd13: 'Символ уважения и чистоты',
                detcd14: 'Ваша улыбка — наше главное украшение. Заранее благодарим за вклад в создание атмосферы уважения и тепла.',
                galler1: 'АДРЕС РЕСТОРАНА', 
                galler2: 'Фотографии ресторана',
                galler3: 'Внешний вид', 
                galler4: 'Ресторан «SARBON»',
                galler5: 'Фергана, улица Фергана, 27б',
                galler6: 'Интерьер', 
                galler7: 'Роскошный интерьер',
                galler8: 'Светлые и просторные залы, уютная атмосфера для гостей',
                locat1: 'РАСПОЛОЖЕНИЕ И МАРШРУТ', 
                locat2: 'Найдите нас',
                locat3: 'Ресторан «SARBON»',
                locat4: 'Фергана, улица Фергана, 27б', 
                locat5: 'Создать маршрут', 
                gift11: 'Подарки',
                gift22: 'Просьбы к гостям',
                gift33: 'Для нас самое главное — ваше присутствие рядом с нами в этот свадебный вечер. Мы искренне ценим ваше внимание и участие!',
                gift44: 'Если вы хотите порадовать нас ещё больше, будем очень признательны, если вы выразите своё внимание к нашей молодой семье в виде конверта.',
                gift55: 'Уважаемые гости!',
                gift66: 'Просим вас не дарить деньги во время танцев. Ваша искренняя улыбка и добрые пожелания — самый ценный подарок для нас.',
                clos11: 'Добро пожаловать на свадьбу!',
                clos22: 'Выражаем искреннюю благодарность за то,',
                clos33: 'что вы с нами в этот счастливый день.',
                clos44: 'С уважением,',
                share11: 'ПОДЕЛИТЕСЬ ПРИГЛАШЕНИЕМ',
                share22: 'Расскажите своим друзьям',
                share33: 'Поделитесь приглашением с близкими — они тоже приглашены на наш праздник!',
                share44: 'Копировать',
                share55: 'Ссылка скопирована!',
                date11: '13 июня & 21 июня 2026',
                gift77: 'Для нашего праздника создана специальная группа в Telegram. Там вы можете найти дополнительную информацию и поделиться радостными моментами дня свадьбы через фото и видео.',
                gift88: 'Перейти в Telegram',
                date22: 'Спасибо за то, что были с нами в этот самый прекрасный день!',
                guestsTag: 'СПИСОК ГОСТЕЙ',
                guestsTitle: 'Таблица участников',
                thName: 'Имя гостя',
                thStatus: 'Статус',
                thComment: 'Комментарий',
                thTime: 'Время',
                statTotal: 'Всего гостей:',
                statConfirmed: 'Подтверждено:',
                statDeclined: 'Не придут:'
            },
            uz: { 
                title: 'SIZGA TAKLIFNOMA KELDI', 
                instruction: 'Qulfchani bosib,', 
                instruction1: 'taklifnomani oching',
                heros1: 'To‘yga taklifnoma',
                heros2: '13-iyun & 21-iyun 2026',
                herodate: 'Sizning ishtirokingiz — biz uchun eng qadrli sovg‘a',
                timerlabel1: 'KELIN TOMONI TO‘YIGA',
                timerlabel2: 'KUYOV TOMONI TO‘YIGA',
                timerside1: 'Kelin tomoni',
                timerside2: 'Kuyov tomoni',
                unit11: 'kun',
                unit22: 'soat',
                unit33: 'daqiqa',
                unit44: 'soniya',
                scroll11: 'Pastga aylantirin',
                tag11: 'Hurmatli mehmonlar',
                quote11: 'Biz uchun aziz bo‘lgan ushbu kunni siz bilan birga nishonlashni istaymiz. Quvonchimizga sherik bo‘lishingizdan mamnun bo‘lamiz.',
                cal11: 'SANALGAN KUNLAR',
                cal22: 'To‘y kalendari',
                cal33: 'IYUN 2026',
                cale1: 'Du',
                cale2: 'Se',
                cale3: 'Ch',
                cale4: 'Pa',
                cale5: 'Ju',
                cale6: 'Sh',
                cale7: 'Ya',
                notetext1: 'yurak — to‘y kuni',
                detcd1: 'To‘yimiz haqida qisqacha',
                detcd2: 'Tadbir tafsilotlari',
                detcd3: 'Manzil',
                detcd4: '«SARBON» restorani, Fargʻona, Fargʻona koʻchasi, 27b-uy',
                detcd5: 'Xaritada ochish →',
                detcd6: 'To‘y dasturi',
                detcd22: 'Manzillar',
                detcd23: `«QANDAK» to'yxonasi, Rishton tumani`,
                'detcd-side1': 'Kelin tomoni',
                'detcd-side2': 'Kuyov tomoni',
                detcd7: '21-iyun, 2026',
                detcd24: '13-iyun, 2026',
                detcd8: '05:00 — Nahor Oshi',
                detcd8b: '17:00 — To‘y Bazmi',
                detcd25: '11:00 — To‘y Bazmi (kelin tomoni uchun)',
                detcd9: 'Kiyinish kodi',
                detcd10: 'Rasmiy, afzal ko‘rang yorug‘ ranglar',
                detcd11: 'Format',
                detcd12: 'Halol. Tantanali tadbir alkogolsiz ichimliklarsiz o‘tkaziladi',
                detcd13: 'Hurmat va poklik ramzi',
                detcd14: 'Sizning tabassumingiz — bizning eng katta bezakimiz. Hurmat va mehr muhitini yaratishga qo‘shilgan hissangiz uchun oldindan rahmat.',
                galler1: 'RESTORAN MANZILI', 
                galler2: 'Restoran fotosuratlari',
                galler3: 'Tashqi ko‘rinish', 
                galler4: '«SARBON» restorani',
                galler5: 'Fargʻona, Fargʻona koʻchasi, 27b-uy',
                galler6: 'Ichki makon', 
                galler7: 'Hashamatli ichki makon',
                galler8: 'Yorug‘ va keng zallar, mehmonlar uchun qulay muhit',
                locat1: 'JOYLASHUV VA YO‘NALISH', 
                locat2: 'Bizni toping',
                locat3: '«SARBON» restorani',
                locat4: 'Fargʻona, Fargʻona koʻchasi, 27b-uy', 
                locat5: 'Marshrut yaratish', 
                gift11: 'Sovg‘alar',
                gift22: 'Mehmonlarga iltimoslar',
                gift33: 'Biz uchun eng muhimi — sizning to‘y oqshomida yonimizda bo‘lishingiz. E’tiboringiz va ishtirokingizni chin qalbdan qadrlaymiz!',
                gift44: 'Agar bizni yanada xursand qilmoqchi bo‘lsangiz, yosh oilamizga ko‘rsatgan e’tiboringizni konvert shaklida bildirsangiz, bundan benihoya mamnun bo‘lamiz.',
                gift55: 'Hurmatli mehmonlar!',
                gift66: 'Raqs vaqtida pul qistirmasligingizni iltimos qilamiz. Sizning samimiy tabassumingiz va ezgu tilaklaringiz biz uchun eng qimmatli hadyadir.',
                gift77: 'Bayramimiz uchun maxsus Telegram guruhi tashkil etilgan. U yerda qo‘shimcha ma’lumotlar bilan tanishishingiz hamda to‘y kunidagi quvonchli lahzalarni foto va videolar orqali ulashishingiz mumkin.',
                gift88: 'Telegramga o‘tish',
                clos11: 'To‘yga xush kelibsiz!',
                clos22: 'Bu baxtli kunda biz bilan birga bo‘lganingiz uchun',
                clos33: 'samimiy minnatdorchilik bildiramiz.',
                clos44: 'Hurmat bilan,',
                share11: 'TAKLIFNOMANI ULASHING',
                share22: 'Do‘stlaringizga yetkazing',
                share33: 'Taklifnomani yaqinlaringizga ham ulashing — ular ham bizning bayramimizga taklif qilingan!',
                share44: 'Nusxa olish',
                share55: 'Havola nusxalandi!',
                date11: '13-iyun & 21-iyun 2026',
                date22: 'Eng go‘zal kunda biz bilan birga bo‘lganingiz uchun tashakkur!'
            },
            uzk: { 
                title: 'СИЗГА ТАКЛИФНОМА КЕЛДИ', 
                instruction: 'Қулфчани босиб,', 
                instruction1: 'таклифномани очинг',
                heros1: 'Тўйга таклифнома',
                heros2: '13-ийун & 21-ийун 2026',
                herodate: 'Сизнинг иштирокингиз — биз учун энг қадрли совға',
                timerlabel1: 'КЕЛИН ТОМОНИ ТЎЙИГА',
                timerlabel2: 'КУЁВ ТОМОНИ ТЎЙИГА',
                timerside1: 'Келин томони',
                timerside2: 'Куёв томони',
                unit11: 'кун',
                unit22: 'соат',
                unit33: 'дақиқа',
                unit44: 'сония',
                scroll11: 'пастга айлантиринг',
                tag11: 'Ҳурматли меҳмонлар!',
                quote11: 'Биз учун азиз бўлган ушбу кунни сиз билан бирга нишонлашни истаймиз. Қувончимизга шерик бўлишингиздан мамнун бўламиз.',
                cal11: 'САНОҚЛИ КУНЛАР',
                cal22: 'Тўй календари',
                cal33: 'ИЙУН 2026',
                cale1: 'Ду',
                cale2: 'Се',
                cale3: 'Чо',
                cale4: 'Па',
                cale5: 'Жу',
                cale6: 'Ша',
                cale7: 'Як',
                notetext1: 'юрак — тўй куни',
                detcd1: 'Тўйимиз ҳақида қисқача',
                detcd2: 'Тадбир тафсилотлари',
                detcd3: 'Манзил',
                detcd4: '«SARBON» ресторани, Фарғона, Фарғона кўчаси, 27б',
                detcd5: 'Харитада очиш →',
                detcd6: 'Тўй дастури',
                 detcd22: 'Манзиллар',
                 detcd23: `«КАНДАК» тўйхонаси, Риштон тумани`,
                'detcd-side1': 'Келин томони',
                'detcd-side2': 'Куёв томони',
                detcd7: '21-ийун, 2026',
                detcd24: '13-ийун, 2026',
                detcd8: '05:00 — Наҳор Оши',
                detcd8b: '17:00 — Тўй Базми',
                detcd25: '11:00 — Тўй Базми (келин томони учун)',
                detcd9: 'Кийиниш коди',
                detcd10: 'Расмий, ёруғ ранглар афзал',
                detcd11: 'Формат',
                detcd12: 'Ҳалол. Тантанали тадбир алкоголсиз ўтказилади',
                detcd13: 'Ҳурмат ва поклик рамзи',
                detcd14: 'Сизнинг табассумингиз — бизнинг энг катта безагимиз. Ҳурмат ва меҳр муҳитини яратишга қўшган ҳиссангиз учун олдиндан раҳмат.',
                galler1: 'РЕСТОРАН МАНЗИЛИ', 
                galler2: 'Ресторан фотосуратлари',
                galler3: 'Ташқи кўриниш', 
                galler4: '«SARBON» ресторани',
                galler5: 'Фарғона, Фарғона кўчаси, 27б',
                galler6: 'Ички макон', 
                galler7: 'Ҳашаматли ички макон',
                galler8: 'Ёруғ ва кенг заллар, меҳмонлар учун қулай муҳит',
                locat1: 'ЖОЙЛАШУВ ВА ЙЎНАЛИШ', 
                locat2: 'Бизни топинг',
                locat3: '«SARBON» ресторани',
                locat4: 'Фарғона, Фарғона кўчаси, 27б', 
                locat5: 'Маршрут яратиш', 
                guest11: '1 дан 5 гача',
                gift11: 'Совғалар',
                gift22: 'Меҳмонларга илтимослар',
                gift33: 'Биз учун энг муҳими — сизнинг тўй оқшомида ёнимизда бўлишингиз. Эътиборингиз ва иштирокингизни чин қалбдан қадрлаймиз!',
                gift44: 'Агар бизни янада хурсанд қилмоқчи бўлсангиз, ёш оиламизга кўрсатган эътиборингизни конверт шаклида билдирсангиз, бундан беҳад мамнун бўламиз.',
                gift55: 'Ҳурматли меҳмонлар!',
                gift66: 'Рақс вақтида пул қистирмаслигингизни илтимос қиламиз. Сизнинг самимий табассумингиз ва эзгу тилакларингиз биз учун энг қимматли ҳадядир.',
                gift77: 'Байрамимиз учун махсус Telegram гуруҳи ташкил этилган. У ерда қўшимча маълумотлар билан танишишингиз ҳамда тўй кунидаги қувончли лаҳзаларни фото ва видеолар орқали улашишингиз мумкин.',
                gift88: 'Telegramга ўтиш',
                clos11: 'Тўйга хуш келибсиз!',
                clos22: 'Бу бахтли кунда биз билан бирга бўлганингиз учун',
                clos33: 'самимий миннатдорчилик билдирамиз.',
                clos44: 'Ҳурмат билан,',
                share11: 'ТАКЛИФНОМАНИ УЛАШИНГ',
                share22: 'Дўстларингизга етказинг',
                share33: 'Таклифномани яқинларингизга ҳам улашинг — улар ҳам бизнинг байрамимизга таклиф қилинган!',
                share44: 'Нусха олиш',
                share55: 'Ҳавола нусхаланди!',
                date11: '13-ийун & 21-ийун 2026',
                date22: 'Энг гўзал кунда биз билан бирга бўлганингиз учун ташаккур!',
                guestsTag: 'МЕҲМОНЛАР РЎЙХАТИ',
                guestsTitle: 'Иштирокчилар жадвали',
                thName: 'Меҳмон исми',
                thStatus: 'Ҳолат',
                thComment: 'Изоҳ',
                thTime: 'Вақт',
                statTotal: 'Жами меҳмонлар:',
                statConfirmed: 'Тасдиқланди:',
                statDeclined: 'Кела олмайди:'
            },
            en: { 
                title: 'YOU HAVE RECEIVED AN INVITATION', 
                instruction: 'Click the lock', 
                instruction1: 'to open the invitation',
                heros1: 'Wedding Invitation',
                heros2: 'June 13 & June 21, 2026',
                herodate: 'Your presence is the most precious gift to us',
                timerlabel1: "BRIDE'S WEDDING",
                timerlabel2: "GROOM'S WEDDING",
                timerside1: "Bride's Side",
                timerside2: "Groom's Side",
                unit11: 'days',
                unit22: 'hours',
                unit33: 'minutes',
                unit44: 'seconds',
                scroll11: 'scroll down',
                tag11: 'Dear Guests',
                quote11: 'We wish to celebrate this day, which is so dear to us, together with you. We would be delighted to have you share in our joy.',
                cal11: 'COUNTING DAYS',
                cal22: 'Wedding Calendar',
                cal33: 'JUNE 2026',
                cale1: 'Mon',
                cale2: 'Tue',
                cale3: 'Wed',
                cale4: 'Thu',
                cale5: 'Fri',
                cale6: 'Sat',
                cale7: 'Sun',
                notetext1: 'heart — wedding day',
                detcd1: 'About Our Wedding',
                detcd2: 'Event Details',
                detcd3: 'Location',
                detcd4: '«SARBON» Restaurant, Fergana, Fergana Street, 27b',
                detcd5: 'Open on map →',
                detcd6: 'Wedding Program',
                 detcd22: 'Venues',
                    detcd23: '«QANDAK» Wedding House, Rishton District',
                'detcd-side1': "Bride's Side",
                'detcd-side2': "Groom's Side",
                detcd7: 'June 21, 2026',
                detcd24: 'June 13, 2026',
                detcd8: '05:00 — Morning Pilaf',
                detcd8b: '17:00 — Wedding Banquet',
                detcd25: '11:00 — Wedding Banquet (for bride’s side)',
                detcd9: 'Dress Code',
                detcd10: 'Formal, preferably light colors',
                detcd11: 'Format',
                detcd12: 'Halal. The event will be held without alcoholic beverages',
                detcd13: 'Symbol of Respect and Purity',
                detcd14: 'Your smile is our greatest decoration. Thank you in advance for contributing to an atmosphere of respect and warmth.',
                galler1: 'RESTAURANT ADDRESS', 
                galler2: 'Restaurant photos',
                galler3: 'Exterior', 
                galler4: '«SARBON» restaurant',
                galler5: 'Fergana, Fergana Street, 27b',
                galler6: 'Interior', 
                galler7: 'Luxurious interior',
                galler8: 'Bright and spacious halls, comfortable atmosphere for guests',
                locat1: 'LOCATION AND DIRECTIONS', 
                locat2: 'Find us',
                locat3: '«SARBON» restaurant',
                locat4: 'Fergana, Fergana Street, 27', 
                locat5: 'Get directions', 
                gift11: 'Gifts',
                gift22: 'Requests to Guests',
                gift33: 'The most important thing for us is your presence by our side on this special wedding evening. We truly appreciate your attention and participation!',
                gift44: 'If you would like to make us even happier, we would be sincerely grateful if you present your gift to our young family in the form of an envelope.',
                gift55: 'Dear guests!',
                gift66: 'We kindly ask you not to give money during the dances. Your sincere smiles and warm wishes are the most valuable gift for us.',
                gift77: 'A special Telegram group has been created for our celebration. There you can find additional information and share joyful moments from the wedding day through photos and videos.',
                gift88: 'Go to Telegram',
                clos11: 'Welcome to the wedding!',
                clos22: 'We express our sincere gratitude for',
                clos33: 'being with us on this happy day.',
                clos44: 'Sincerely,',
                share11: 'SHARE THE INVITATION',
                share22: 'Tell your friends',
                share33: 'Share the invitation with your loved ones — they are also invited to our celebration!',
                share44: 'Copy',
                share55: 'Link copied!',
                date11: 'June 13 & June 21, 2026',
                date22: 'Thank you for being with us on this most beautiful day!',
                guestsTag: 'GUEST LIST',
                guestsTitle: 'Attendees Table',
                thName: 'Guest Name',
                thStatus: 'Status',
                thComment: 'Comment',
                thTime: 'Time',
                statTotal: 'Total guests:',
                statConfirmed: 'Confirmed:',
                statDeclined: 'Declined:'
            }
        };
        
        if (translations[lang]) {
            const t = translations[lang];
            const qs = (sel) => document.querySelector(sel);
            const qsa = (sel) => document.querySelectorAll(sel);
            const set = (sel, val) => { const el = qs(sel); if (el && val !== undefined) el.textContent = val; };
            const setAll = (sel, val) => { if (val !== undefined) qsa(sel).forEach(el => el.textContent = val); };

            set('.unlock-title', t.title);
            set('.unlock-instruction', t.instruction);
            set('.unlock1-instruction1', t.instruction1);
            set('.heros1', t.heros1);
            set('.heros2', t.heros2);
            set('.hero-date', t.herodate);
            set('.timer-label-kelin', t.timerlabel1);
            set('.timer-label-kuyov', t.timerlabel2);
            set('.timer-kelin-label', t.timerside1);
            set('.timer-kuyov-label', t.timerside2);
            setAll('.unit11', t.unit11);
            setAll('.unit22', t.unit22);
            setAll('.unit33', t.unit33);
            setAll('.unit44', t.unit44);
            set('.scroll11', t.scroll11);
            set('.tag11', t.tag11);
            set('.quote11', t.quote11);
            set('.cal11', t.cal11);
            set('.cal22', t.cal22);
            set('.cal33', t.cal33);
            set('.cale1', t.cale1);
            set('.cale2', t.cale2);
            set('.cale3', t.cale3);
            set('.cale4', t.cale4);
            set('.cale5', t.cale5);
            set('.cale6', t.cale6);
            set('.cale7', t.cale7);
            set('.notetext1', t.notetext1);
            set('.detcd1', t.detcd1);
            set('.detcd2', t.detcd2);
            set('.detcd3', t.detcd3);
            set('.detcd4', t.detcd4);
            set('.detcd5', t.detcd5);
            set('.detcd6', t.detcd6);
            set('.detcd22', t.detcd22);
            set('.detcd23', t.detcd23);
            set('.detcd-side1', t['detcd-side1']);
            set('.detcd-side2', t['detcd-side2']);
            set('.detcd7', t.detcd7);
            set('.detcd24', t.detcd24);
            set('.detcd8', t.detcd8);
            set('.detcd25', t.detcd25);
            set('.detcd8b', t.detcd8b);
            set('.detcd9', t.detcd9);
            set('.detcd10', t.detcd10);
            set('.detcd11', t.detcd11);
            set('.detcd12', t.detcd12);
            set('.detcd13', t.detcd13);
            set('.detcd14', t.detcd14);
            set('.galler1', t.galler1);
            set('.galler2', t.galler2);
            set('.galler3', t.galler3);
            set('.galler4', t.galler4);
            set('.galler5', t.galler5);
            set('.galler6', t.galler6);
            set('.galler7', t.galler7);
            set('.galler8', t.galler8);
            set('.locat1', t.locat1);
            set('.locat2', t.locat2);
            set('.locat3', t.locat3);
            set('.locat4', t.locat4);
            set('.locat5', t.locat5);
            set('.gift11', t.gift11);
            set('.gift22', t.gift22);
            set('.gift33', t.gift33);
            set('.gift44', t.gift44);
            set('.gift55', t.gift55);
            set('.gift66', t.gift66);
            set('.clos11', t.clos11);
            set('.clos22', t.clos22);
            set('.clos33', t.clos33);
            set('.clos44', t.clos44);
            set('.share11', t.share11);
            set('.share22', t.share22);
            set('.share33', t.share33);
            set('.share44', t.share44);
            set('.share55', t.share55);
            setAll('.date11', t.date11);
            set('.date22', t.date22);
            // Guests section
            set('.guests-tag', t.guestsTag);
            set('.guests-title', t.guestsTitle);
            set('.th-name', t.thName);
            set('.th-status', t.thStatus);
            set('.th-comment', t.thComment);
            set('.th-time', t.thTime);
            set('.stat-total', t.statTotal);
            set('.stat-confirmed-label', t.statConfirmed);
            set('.stat-declined-label', t.statDeclined);
        }
        translateRsvpSection(lang);
    });
});

document.querySelector('.lang-btn[data-lang="uz"]').classList.add('active');

function translateRsvpSection(lang) {
    const translations = {
        ru: {
            tag: 'ПОДТВЕРДИТЕ СВОЕ ПРИСУТСТВИЕ',
            title: 'Будьте с нами',
            nameLabel: 'Имя гостя',
            namePlaceholder: 'Введите ваше имя',
            guestsLabel: 'Количество гостей',
            attendanceLabel: 'Вы придете на свадьбу?',
            attendanceYes: 'Да, с удовольствием',
            attendanceNo: 'К сожалению, не смогу прийти',
            commentLabel: 'Комментарий (необязательно)',
            commentPlaceholder: 'Ваши пожелания или вопросы',
            submitBtn: 'Отправить',
            noteText: 'Обязательные поля',
            toastMessage: 'Спасибо! Ваш ответ успешно сохранен'
        },
        uz: {
            tag: 'ISHTIROKINGIZNI TASDIQLANG',
            title: 'Biz bilan bo‘ling',
            nameLabel: 'Mehmon ismi',
            namePlaceholder: 'Ismingizni kiriting',
            guestsLabel: 'Mehmonlar soni',
            attendanceLabel: "To'yga kelasizmi?",
            attendanceYes: 'Ha, mamnuniyat bilan',
            attendanceNo: 'Afsuski, kela olmayman',
            commentLabel: 'Sharh (ixtiyoriy)',
            commentPlaceholder: 'Sizning tilaklaringiz yoki savollaringiz',
            submitBtn: 'Yuborish',
            noteText: 'Majburiy maydonlar',
            toastMessage: 'Rahmat! Javobingiz muvaffaqiyatli saqlandi'
        },
        uzk: {
            tag: 'ИШТИРОКИНГИЗНИ ТАСДИҚЛАНГ',
            title: 'Биз билан бўлинг',
            nameLabel: 'Меҳмон исми',
            namePlaceholder: 'Исмингизни киритинг',
            guestsLabel: 'Меҳмонлар сони',
            attendanceLabel: "Тўйга келасизми?",
            attendanceYes: 'Ҳа, мамнуният билан',
            attendanceNo: 'Афсуски, кела олмайман',
            commentLabel: 'Шарҳ (ихтиёрий)',
            commentPlaceholder: 'Сизнинг тилакларингиз ёки саволларингиз',
            submitBtn: 'Юбориш',
            noteText: 'Мажбурий майдонлар',
            toastMessage: 'Раҳмат! Жавобингиз муваффақиятли сақланди'
        },
        en: {
            tag: 'CONFIRM YOUR ATTENDANCE',
            title: 'Be with us',
            nameLabel: 'Guest name',
            namePlaceholder: 'Enter your name',
            guestsLabel: 'Number of guests',
            attendanceLabel: 'Will you attend the wedding?',
            attendanceYes: 'Yes, with pleasure',
            attendanceNo: 'Unfortunately, I cannot come',
            commentLabel: 'Comment (optional)',
            commentPlaceholder: 'Your wishes or questions',
            submitBtn: 'Submit',
            noteText: 'Required fields',
            toastMessage: 'Thank you! Your response has been successfully saved'
        }
    };

    const t = translations[lang] || translations.uz;
    const rsvpSection = document.querySelector('.rsvp-section');
    if (!rsvpSection) return;

    const tag = rsvpSection.querySelector('.tag');
    if (tag) tag.textContent = t.tag;

    const title = rsvpSection.querySelector('.sec-title');
    if (title) title.innerHTML = t.title;

    const formLabels = rsvpSection.querySelectorAll('.form-label .label-text');
    if (formLabels[0]) formLabels[0].textContent = t.nameLabel;
    if (formLabels[1]) formLabels[1].textContent = t.guestsLabel;
    if (formLabels[2]) formLabels[2].textContent = t.attendanceLabel;
    if (formLabels[3]) formLabels[3].textContent = t.commentLabel;

    const nameInput = rsvpSection.querySelector('.form-input');
    if (nameInput) nameInput.placeholder = t.namePlaceholder;

    const textarea = rsvpSection.querySelector('.form-textarea');
    if (textarea) textarea.placeholder = t.commentPlaceholder;

    const radioTexts = rsvpSection.querySelectorAll('.radio-text');
    if (radioTexts[0]) radioTexts[0].textContent = t.attendanceYes;
    if (radioTexts[1]) radioTexts[1].textContent = t.attendanceNo;

    const submitBtn = rsvpSection.querySelector('.submit-btn .btn-text');
    if (submitBtn) submitBtn.textContent = t.submitBtn;

    const noteText = rsvpSection.querySelector('.form-note .note-text');
    if (noteText) noteText.textContent = t.noteText;

    const toastSpan = document.querySelector('#toastMessage span');
    if (toastSpan) toastSpan.textContent = t.toastMessage;
}

// ========== AJAX FORM SUBMISSION ==========
(function() {
    const form = document.getElementById('rsvpForm');
    const toast = document.getElementById('toastMessage');
    
    // Ma'lumotlar localStorage'ga saqlanadi
    
    function getFormData() {
        const nameInput = form.querySelector('.form-input');
        const guestCountSpan = document.querySelector('.guest-count');
        const attendanceRadio = form.querySelector('input[name="attendance"]:checked');
        const textarea = form.querySelector('.form-textarea');
        
        return {
            name: nameInput ? nameInput.value.trim() : '',
            guestCount: 1,
            attendance: attendanceRadio ? attendanceRadio.value : 'yes',
            comment: textarea ? textarea.value.trim() : ''
        };
    }
    
    function resetForm() {
        const nameInput = form.querySelector('.form-input');
        const guestCountSpan = document.querySelector('.guest-count');
        const textarea = form.querySelector('.form-textarea');
        const yesRadio = form.querySelector('input[value="yes"]');
        
        if (nameInput) nameInput.value = '';
        if (guestCountSpan) guestCountSpan.textContent = '1';
        if (textarea) textarea.value = '';
        if (yesRadio) yesRadio.checked = true;
        
        const minusBtn = document.querySelector('.guest-minus');
        const plusBtn = document.querySelector('.guest-plus');
        if (window.guestCounter) window.guestCounter = 1;
    }
    
    function showToast(message) {
        if (!toast) return;
        
        const toastSpan = toast.querySelector('span');
        if (toastSpan && message) {
            toastSpan.textContent = message;
        }
        
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
    
    function validateForm(data) {
        if (!data.name) {
            const nameInput = form.querySelector('.form-input');
            if (nameInput) {
                nameInput.style.borderColor = '#363636';
                nameInput.focus();
            }
            return false;
        }
        return true;
    }
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = getFormData();
            
            if (!validateForm(formData)) {
                return;
            }
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn?.querySelector('.btn-text')?.textContent || 'Yuborish';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                const btnText = submitBtn.querySelector('.btn-text');
                if (btnText) btnText.textContent = 'Yuborilmoqda...';
            }
            
            try {
                saveGuestToStorage(formData);
                resetForm();
                showToast();
                loadGuestsFromDB();
            } catch (error) {
                console.error('Save error:', error);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const btnText = submitBtn.querySelector('.btn-text');
                    if (btnText) btnText.textContent = originalBtnText;
                }
            }
        });
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const footerTrigger = document.querySelector('.footer-names');
    const guestSection = document.getElementById('guests123');
    
    let clickCount = 0;
    let lastClickTime = 0;

    const PASSWORD = "1234"; // ← задай свой пароль

    if (footerTrigger && guestSection) {
        footerTrigger.addEventListener('click', () => {
            const currentTime = new Date().getTime();
            
            if (currentTime - lastClickTime > 1500) {
                clickCount = 0;
            }
            
            clickCount++;
            lastClickTime = currentTime;

            if (clickCount === 3) {
                
                const userPassword = prompt("Parolni kiriting:");

                if (userPassword === PASSWORD) {
                    // переключение видимости
                    if (guestSection.style.display === 'block') {
                        guestSection.style.display = 'none';
                    } else {
                        guestSection.style.display = 'block';
                    }
                } else {
                    alert("Parol noto‘g‘ri ❌");
                }

                clickCount = 0;
            }
        });
    }
});