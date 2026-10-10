/* Просебя · аварийный флоу · общая логика
   Страница задаёт раскладку атрибутами на <body>:
     data-layout="guest" | "client" | "app"
     data-active="sessions" | "support"   (подсветка пункта меню)
     data-user="Анастасия"                (имя в шапке)
   <main class="main-wrap"> оборачивается шапкой, меню, футером и мобильным меню. */
(function () {
  "use strict";

  /* ---------- Иконки (из Figma: icon/sidebar/calendar, icon/sidebar/chat, log-out-24) ---------- */
  var ICONS = {
    calendar:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.59766" y="5" width="16.8" height="15.4" rx="2.33236" fill="#344079" fill-opacity="0.1" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.79792 3.59961V6.3996M16.1953 3.59961V6.3996M3.59766 9.66629H20.3976" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chat:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 10.476C4 6.353 7.587 3 12 3C16.413 3 20 6.353 20 10.476C20 15.551 15.374 19.014 11 21V18C6.847 17.794 4 14.496 4 10.476Z" fill="#344079" fill-opacity="0.1"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.125C16.8392 2.12519 20.8748 5.81483 20.875 10.4756C20.875 13.3032 19.5796 15.6458 17.7666 17.5068C15.9612 19.36 13.6061 20.7776 11.3613 21.7969C11.0907 21.9196 10.7762 21.8962 10.5264 21.7354C10.2763 21.5743 10.125 21.2974 10.125 21V18.792C5.92806 18.1867 3.125 14.6551 3.125 10.4756C3.12524 5.81471 7.1606 2.125 12 2.125ZM12 3.875C8.0137 3.875 4.87524 6.89083 4.875 10.4756C4.875 14.0655 7.39154 16.9447 11.043 17.126C11.5086 17.1493 11.875 17.5337 11.875 18L11.875 19.6016C13.5789 18.7161 15.2234 17.6106 16.5137 16.2861C18.107 14.6505 19.125 12.7228 19.125 10.4756C19.1248 6.89094 15.9861 3.87518 12 3.875ZM12 13C12.5522 13.0001 13 13.4478 13 14C13 14.5522 12.5522 14.9999 12 15C11.4477 15 11 14.5523 11 14C11 13.4477 11.4477 13 12 13ZM11.9375 6.62891C13.3627 6.5502 14.5851 7.63684 14.6738 9.06152C14.6749 9.0794 14.6758 9.09732 14.6758 9.11523C14.6758 10.0008 14.1954 10.8177 13.4209 11.248L12.4258 11.8008C12.0035 12.0353 11.4711 11.8831 11.2363 11.4609C11.0016 11.0385 11.1537 10.5052 11.5762 10.2705L12.5713 9.71777C12.7833 9.59988 12.9161 9.3795 12.9238 9.1377C12.8789 8.68907 12.489 8.35129 12.0352 8.37598C12.0071 8.37753 11.9782 8.3781 11.9502 8.37695C11.526 8.35934 11.1488 8.64603 11.0527 9.05957C10.9435 9.5302 10.4736 9.82287 10.0029 9.71387C9.53224 9.6046 9.23942 9.13478 9.34863 8.66406C9.62845 7.45871 10.7077 6.61721 11.9375 6.62891Z" fill="currentColor"/></svg>',
    logout:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 16.0001V18.0421C4 19.1471 4.895 20.0421 6 20.0421H9M4 8.00014V6.00014C4 4.89514 4.895 4.00014 6 4.00014H9M4 12.0001H9M7 10.0001L9 12.0001L7 14.0001M14.163 21.0001L18.607 20.0121C19.421 19.8321 20 19.1101 20 18.2771V5.76614C20 4.93314 19.421 4.21114 18.608 4.03114L14.164 3.04314C13.053 2.79614 12 3.64114 12 4.77914V19.2651C12 20.4021 13.053 21.2471 14.163 21.0001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    user:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="5.5" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 13.5c.6-2.4 2.5-3.5 5-3.5s4.4 1.1 5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    back:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron:
      '<svg class="icon-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cross:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    check:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chatPlus:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10.476C4 6.353 7.587 3 12 3C16.413 3 20 6.353 20 10.476C20 15.551 15.374 19.014 11 21V18C6.847 17.794 4 14.496 4 10.476Z" fill="#344079" fill-opacity="0.1" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7.9V13.1M9.4 10.5H14.6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    link:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6.5 9.5L9.5 6.5M7 4.5L8.3 3.2C9.4 2.1 11.2 2.1 12.3 3.2C13.4 4.3 13.4 6.1 12.3 7.2L11 8.5M9 11.5L7.7 12.8C6.6 13.9 4.8 13.9 3.7 12.8C2.6 11.7 2.6 9.9 3.7 8.8L5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    calendarSmall:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.6" y="5" width="16.8" height="15.4" rx="2.3" stroke="currentColor" stroke-width="2"/><path d="M7.8 3.6v2.8M16.2 3.6v2.8M3.6 9.7h16.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  window.ICONS = ICONS;

  /* ---------- Данные ---------- */
  var MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  var WEEKDAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
  // «Сегодня» для макета: пятница, 9 октября 2026, 14:07
  var TODAY = new Date(2026, 9, 9);
  var NOW = new Date(2026, 9, 9, 14, 7);

  function addDays(d, n) { var r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function dateLabel(d) { return d.getDate() + " " + MONTHS[d.getMonth()]; }
  function dayLabel(offset) {
    /* как в макете: «9 октября  Сегодня», «10 октября  Завтра», дальше — только дата */
    var d = addDays(TODAY, offset);
    return { title: dateLabel(d), tag: offset === 0 ? "Сегодня" : offset === 1 ? "Завтра" : "" };
  }
  window.PS = { MONTHS: MONTHS, WEEKDAYS: WEEKDAYS, TODAY: TODAY, NOW: NOW, addDays: addDays, dateLabel: dateLabel, dayLabel: dayLabel };

  /* Специальности — как в макете «Список специальностей» */
  var SPECIALTIES = [
    { id: "guide", title: "Гайд-сессия", desc: "Когда нужно понять, с чего начать, и выбрать своего специалиста" },
    { id: "psychologist", title: "Психолог", desc: "Разобраться в жизненных проблемах, научиться регулировать свое состояние" },
    { id: "family", title: "Семейный психолог", desc: "Разобраться в сложностях, наладить диалог и укрепить близость" },
    { id: "child", title: "Детский и подростковый психолог", desc: "Помочь родителям и детям справиться со сложностями и улучшить взаимопонимание" },
    { id: "coach", title: "Коуч", desc: "Раскрыть потенциал и достичь конкретных целей" },
    { id: "psychotherapist", title: "Психотерапевт", desc: "Справиться с тяжелыми состояниями и ментальными расстройствами" },
    { id: "zozh", title: "ЗОЖ-эксперт", desc: "Наладить правильное питание и физическую активность" },
    { id: "zoo", title: "Зоопсихолог", desc: "Понять потребности своего питомца и получить советы по уходу за ним" },
    { id: "finance", title: "Финансовый эксперт", desc: "Научиться управлять личным бюджетом и достигать финансовых целей" },
    { id: "fitness", title: "Фитнес-тренер", desc: "Составить план тренировок и улучшить физическую форму" },
    { id: "lawyer", title: "Юрист", desc: "Разобраться в сложностях закона и найти подходящее решение" }
  ];
  window.SPECIALTIES = SPECIALTIES;

  var SPECIALISTS = [
    { id: 1, with: "Анной Кузнецовой", name: "Кузнецова Анна Сергеевна", day: 0, time: "18:00" },
    { id: 2, with: "Екатериной Соколовой", name: "Соколова Екатерина Владимировна", day: 0, time: "19:30" },
    { id: 3, with: "Дмитрием Петровым", name: "Петров Дмитрий Олегович", day: 0, time: "20:30" },
    { id: 4, with: "Максимом Ивановым", name: "Иванов Максим Андреевич", day: 1, time: "10:00" },
    { id: 5, with: "Ольгой Смирновой", name: "Смирнова Ольга Игоревна", day: 1, time: "11:30" },
    { id: 6, with: "Артёмом Поповым", name: "Попов Артём Евгеньевич", day: 1, time: "14:00" },
    { id: 7, with: "Марией Васильевой", name: "Васильева Мария Павловна", day: 2, time: "09:30" },
    { id: 8, with: "Ильёй Морозовым", name: "Морозов Илья Викторович", day: 3, time: "10:00" },
    { id: 9, with: "Натальей Новиковой", name: "Новикова Наталья Алексеевна", day: 4, time: "12:00" },
    { id: 10, with: "Денисом Федоровым", name: "Федоров Денис Станиславович", day: 5, time: "16:00" },
    { id: 11, with: "Еленой Захаровой", name: "Захарова Елена Романовна", day: 6, time: "11:00" }
  ];
  window.SPECIALISTS = SPECIALISTS;

  function whenLabel(s) {
    var d = s.day === 0 ? "сегодня" : s.day === 1 ? "завтра" : dateLabel(addDays(TODAY, s.day));
    return "Запись на " + d + " " + s.time;
  }
  window.whenLabel = whenLabel;

  /* Слоты на 14 дней: [утро, день, вечер, ночь]. Сегодня — только вечер и ночь, дальше больше. */
  var COUNTS = [[0, 0, 3, 2], [8, 9, 6, 3], [7, 9, 6, 3], [8, 10, 6, 3], [8, 10, 7, 3], [9, 10, 7, 3], [9, 11, 7, 4],
    [9, 11, 7, 4], [10, 11, 8, 4], [10, 12, 8, 4], [10, 12, 8, 4], [10, 12, 8, 4], [11, 12, 8, 4], [11, 12, 8, 4]];
  var GROUPS = [
    { key: "morning", title: "Утро", from: 6 * 60, to: 11 * 60 + 30 },
    { key: "day", title: "День", from: 12 * 60, to: 17 * 60 + 30 },
    { key: "evening", title: "Вечер", from: 18 * 60, to: 21 * 60 + 30 },
    { key: "night", title: "Ночь", from: 22 * 60, to: 23 * 60 + 30 }
  ];
  function rng(seed) {
    var x = seed >>> 0 || 1;
    return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmt(min) { return pad(Math.floor(min / 60)) + ":" + pad(min % 60); }
  function slotsFor(dayIndex) {
    return GROUPS.map(function (g, gi) {
      var all = [];
      for (var m = g.from; m <= g.to; m += 30) all.push(m);
      var rand = rng(dayIndex * 10 + gi + 1);
      for (var i = all.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)); var t = all[i]; all[i] = all[j]; all[j] = t; }
      var picked = all.slice(0, COUNTS[dayIndex][gi]).sort(function (a, b) { return a - b; });
      return { key: g.key, title: g.title, times: picked.map(fmt) };
    });
  }
  window.slotsFor = slotsFor;


  /* ---------- Записи клиента (демо-данные в localStorage, сброс: ?reset=1) ---------- */
  var KEY = "ps_records";
  function defaultRecords() {
    return [
      { id: 1, spec: "Психолог", specialist: 2, day: 0, time: "18:00" },
      { id: 2, spec: "Психолог", specialist: 9, day: 4, time: "12:00" }
    ];
  }
  function loadRecords() {
    try {
      if (new URLSearchParams(location.search).get("reset") === "1") localStorage.removeItem(KEY);
      var raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* без хранилища работаем с демо-набором */ }
    return defaultRecords();
  }
  function saveRecords(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* ignore */ } }
  function specialistById(id) { return SPECIALISTS.filter(function (x) { return x.id === +id; })[0] || SPECIALISTS[1]; }
  function specTitle(id) { var s = SPECIALTIES.filter(function (x) { return x.id === id; })[0]; return s ? s.title : "Психолог"; }
  function startsAt(day, time) {
    var d = addDays(TODAY, day), p = time.split(":");
    d.setHours(+p[0], +p[1], 0, 0); return d;
  }
  /* перенос и отмена — не позднее чем за 6 часов до начала */
  function canChange(rec) { return startsAt(rec.day, rec.time) - NOW >= 6 * 3600 * 1000; }
  function whenText(day, time) {
    var d = day === 0 ? "Сегодня" : day === 1 ? "Завтра" : dateLabel(addDays(TODAY, day));
    return d + " в " + time;
  }
  function shortWhen(day, time) { return dateLabel(addDays(TODAY, day)) + ", " + time; }
  function gcalUrl(day, time, who) {
    function f(d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00"; }
    var a = startsAt(day, time), b = new Date(a.getTime() + 30 * 60000);
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent("Сессия в Просебя · " + who) + "&dates=" + f(a) + "/" + f(b);
  }
  window.PS.records = loadRecords;
  window.PS.saveRecords = saveRecords;
  window.PS.specialistById = specialistById;
  window.PS.specTitle = specTitle;
  window.PS.canChange = canChange;
  window.PS.whenText = whenText;
  window.PS.shortWhen = shortWhen;
  window.PS.gcalUrl = gcalUrl;

  /* ---------- Степпер (steps-pagination из дизайн-системы): точки 6 px, активная 12×6 ---------- */
  window.PS.stepper = function (n, total, label) {
    var dots = "";
    for (var i = 1; i <= total; i++) dots += '<i class="stepper__dot' + (i === n ? " is-active" : "") + '"></i>';
    return '<div class="stepper"><div class="stepper__dots" aria-hidden="true">' + dots + '</div><p class="stepper__label">Шаг ' + n + " из " + total + " · " + label + "</p></div>";
  };

  /* ---------- Календарь + время (один тап — сразу дальше) ----------
     mountDateTime(root, { day, onPick(dayIndex, time) }) ; доступны 14 дней начиная с сегодняшнего */
  window.PS.mountDateTime = function (root, opts) {
    var selected = opts.day != null ? opts.day : 1;
    var view = { y: TODAY.getFullYear(), m: TODAY.getMonth() };
    var WD = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    root.innerHTML = '<div class="dt"><div class="dt__cal"><div class="cal" data-cal></div><p class="text-s dt__note">Сессия длится 30 минут</p></div>' +
      '<div class="dt__slots"><h2 class="dt__title" data-title></h2><div class="slots-scroll" data-scroll></div></div></div>';
    var calEl = root.querySelector("[data-cal]"), scroll = root.querySelector("[data-scroll]"), title = root.querySelector("[data-title]");

    function dayIndex(y, m, d) { return Math.round((new Date(y, m, d) - TODAY) / 86400000); }
    function renderCal() {
      var first = new Date(view.y, view.m, 1), lead = (first.getDay() + 6) % 7, days = new Date(view.y, view.m + 1, 0).getDate();
      var atStart = view.y === TODAY.getFullYear() && view.m === TODAY.getMonth();
      var h = '<div class="cal__head"><span class="cal__month">' + MONTHS_NOM[view.m] + " " + view.y + '</span><span class="cal__nav">' +
        '<button type="button" class="cal__arrow" data-prev aria-label="Предыдущий месяц"' + (atStart ? " disabled" : "") + '><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 5l-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<button type="button" class="cal__arrow cal__arrow--next" data-next aria-label="Следующий месяц"' + (!atStart ? " disabled" : "") + '><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></span></div>';
      h += '<div class="cal__grid cal__weekdays">' + WD.map(function (w) { return "<span>" + w + "</span>"; }).join("") + "</div>";
      h += '<div class="cal__grid">';
      for (var i = 0; i < lead; i++) h += "<span></span>";
      for (var d = 1; d <= days; d++) {
        var idx = dayIndex(view.y, view.m, d), ok = idx >= 0 && idx <= 13;
        var cls = "cal__day" + (idx === 0 ? " is-today" : "") + (ok && idx === selected ? " is-selected" : "");
        h += '<span class="cal__cell"><button type="button" class="' + cls + '" data-day="' + idx + '"' + (ok ? "" : " disabled") + ">" + d + "</button></span>";
      }
      calEl.innerHTML = h + "</div>";
    }
    function renderSlots() {
      title.textContent = "Время · " + dateLabel(addDays(TODAY, selected));
      scroll.innerHTML = slotsFor(selected).filter(function (g) { return g.times.length; }).map(function (g) {
        return '<div class="tgroup"><div class="tgroup__cap">' + g.title + '</div><div class="tgrid">' +
          g.times.map(function (t) { return '<button type="button" class="slot" data-time="' + t + '">' + t + "</button>"; }).join("") + "</div></div>";
      }).join("");
      scroll.scrollTop = 0; fade();
    }
    function fade() { scroll.classList.toggle("is-end", scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 2); scroll.classList.toggle("no-scroll", scroll.scrollHeight <= scroll.clientHeight + 2); }
    scroll.addEventListener("scroll", fade);
    calEl.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      if (b.hasAttribute("data-prev")) { view.m--; if (view.m < 0) { view.m = 11; view.y--; } renderCal(); return; }
      if (b.hasAttribute("data-next")) { view.m++; if (view.m > 11) { view.m = 0; view.y++; } renderCal(); return; }
      if (b.dataset.day != null) { selected = +b.dataset.day; renderCal(); renderSlots(); }
    });
    scroll.addEventListener("click", function (e) {
      var b = e.target.closest(".slot"); if (!b) return;
      b.setAttribute("aria-pressed", "true");
      opts.onPick(selected, b.dataset.time);
    });
    renderCal(); renderSlots();
  };
  var MONTHS_NOM = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  /* Кнопка «Скопировать ссылку на встречу»: после клика на пару секунд меняет подпись и иконку */
  window.PS.bindCopy = function (root) {
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-copy]"); if (!b) return;
      var link = b.dataset.copy, label = b.querySelector(".copy-link__label"), ico = b.querySelector(".copy-link__icon");
      function done() {
        b.classList.add("is-copied"); label.textContent = "Ссылка скопирована"; ico.innerHTML = ICONS.check;
        clearTimeout(b.__t); b.__t = setTimeout(function () { b.classList.remove("is-copied"); label.textContent = "Скопировать ссылку на встречу"; ico.innerHTML = ICONS.link; }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, done); else done();
    });
  };

  /* ---------- Каркас страницы ---------- */
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }

  function navItems(active, extraClass) {
    var items = [
      { id: "sessions", href: "sessions.html", icon: "calendar", label: "Мои записи" },
      { id: "support", href: "mailto:service@prosebya.ru", icon: "chat", label: "Служба поддержки" }
    ];
    return items.map(function (i) {
      return '<a class="nav__item' + (i.id === active ? " is-active" : "") + '" href="' + i.href + '">' + ICONS[i.icon] + "<span>" + i.label + "</span></a>";
    }).join("");
  }

  function headerHtml(layout, user) {
    var home = layout === "client" ? "sessions.html" : "index.html";   /* логотип клиента ведёт в «Мои записи» */
    var logo = '<a class="site-header__logo" href="' + home + '" aria-label="Просебя"><img src="assets/logo.svg" alt="Просебя" width="93" height="26"></a>';
    if (layout === "guest") return '<header class="site-header">' + logo + "</header>";
    var userBlock = '<div class="user"><span class="user__avatar">' + ICONS.user + '</span><span class="user__name">' + user +
      '</span><a class="user__logout" href="auth.html" aria-label="Выйти">' + ICONS.logout + "</a></div>";
    if (layout === "client") {
      return '<header class="site-header">' + logo +
        '<button class="menu-btn" type="button" aria-label="Меню" aria-expanded="false" data-menu-open><span class="menu-btn__bars"></span></button>' +
        '<a class="site-header__logout" href="auth.html">' + ICONS.logout + "<span>Выйти</span></a></header>";
    }
    return '<header class="site-header">' + logo +
      '<button class="menu-btn" type="button" aria-label="Меню" aria-expanded="false" data-menu-open><span class="menu-btn__bars"></span></button>' +
      userBlock + "</header>";
  }

  function footerHtml() {
    return '<footer class="site-footer"><div class="site-footer__inner">' +
      '<div class="site-footer__org">ООО «ПРОСЕБЯ»</div>' +
      "<p>Основным направлением деятельности ООО «ПРОСЕБЯ» (ОГРН: 1237700218832) является разработка и внедрение инновационных цифровых b2c и b2bc сервисов (программного обеспечения, в том числе мобильного приложения) для управления психологическим здоровьем, дистанционных консультаций психологов, заключения договоров на оказание услуг психологов.</p>" +
      '<div class="site-footer__links"><span>Поддержка пользователей: service@prosebya.ru</span><a href="#">Юридические документы</a></div>' +
      "</div></footer>";
  }

  function build() {
    var body = document.body;
    var layout = body.dataset.layout || "guest";
    var user = body.dataset.user || "Анастасия";
    var active = body.dataset.active || "";
    var main = document.querySelector("main.main-wrap");
    if (!main) return;

    var wrap = document.createElement("div");
    wrap.className = "layout layout--" + (layout === "app" ? "app" : "guest");
    if (layout === "app") {
      var side = el('<aside class="sidebar"><nav class="nav" aria-label="Меню">' + navItems(active) + "</nav>" +
        '<a class="btn btn--primary btn--sm sidebar__cta" href="specialties.html">Записаться на сессию</a></aside>');
      wrap.appendChild(side);
    }
    main.parentNode.insertBefore(wrap, main);
    wrap.appendChild(main);

    body.insertBefore(el(headerHtml(layout, user)), wrap);
    body.appendChild(el(footerHtml()));

    if (layout === "app" || layout === "client") {
      var drawerHtml;
      if (layout === "client") {
        /* мобильное меню клиента: только два пункта — строки с иконками */
        drawerHtml = '<div class="drawer" role="dialog" aria-modal="true" aria-label="Меню">' +
          '<div class="site-header"><a class="site-header__logo" href="sessions.html"><img src="assets/logo.svg" alt="Просебя" width="93" height="26"></a>' +
          '<button class="menu-btn menu-close" type="button" aria-label="Закрыть меню" data-menu-close></button></div>' +
          '<nav class="drawer__rows" aria-label="Меню">' +
          '<a class="drawer__row' + (active === "sessions" ? " is-active" : "") + '" href="sessions.html">' + ICONS.calendar + "<span>Мои записи</span></a>" +
          '<a class="drawer__row" href="specialties.html">' + ICONS.chatPlus + "<span>Записаться на сессию</span></a>" +
          '<a class="drawer__row drawer__row--quiet" href="auth.html">' + ICONS.logout + "<span>Выйти</span></a></nav></div>";
      } else {
        drawerHtml = '<div class="drawer" role="dialog" aria-modal="true" aria-label="Меню АЗ">' +
          '<div class="site-header"><a class="site-header__logo" href="index.html"><img src="assets/logo.svg" alt="Просебя" width="93" height="26"></a>' +
          '<button class="menu-btn menu-close" type="button" aria-label="Закрыть меню" data-menu-close></button></div>' +
          '<div class="drawer__user"><span class="user__avatar">' + ICONS.user + '</span><span class="drawer__name">' + user + "</span>" +
          '<a class="user__logout" href="auth.html" aria-label="Выйти">' + ICONS.logout + "</a></div>" +
          '<nav class="nav drawer__nav">' + navItems(active) + "</nav>" +
          '<div class="drawer__cta"><a class="btn btn--primary btn--l" href="specialties.html">Записаться на сессию</a></div></div>';
      }
      var drawer = el(drawerHtml);
      body.appendChild(drawer);
      var openBtn = document.querySelector("[data-menu-open]");
      function setOpen(v) { drawer.classList.toggle("is-open", v); openBtn.setAttribute("aria-expanded", String(v)); document.documentElement.style.overflow = v ? "hidden" : ""; }
      openBtn.addEventListener("click", function () { setOpen(true); });
      drawer.querySelector("[data-menu-close]").addEventListener("click", function () { setOpen(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    }
  }

  /* ---------- Утилиты для страниц ---------- */
  window.qs = function (name) { return new URLSearchParams(location.search).get(name); };
  window.showToast = function (text, kind) {   /* kind: "info" | "success"; без него — ошибка */
    var t = document.querySelector(".toast");
    if (!t) { t = el('<div class="toast" role="alert"></div>'); document.body.appendChild(t); }
    t.className = "toast" + (kind ? " toast--" + kind : "");
    t.textContent = text; t.classList.add("is-open");
    clearTimeout(window.__toast); window.__toast = setTimeout(function () { t.classList.remove("is-open"); }, 3000);
  };
  window.setFieldError = function (field, text) {
    field.classList.toggle("is-error", !!text);
    var h = field.querySelector(".field__helper");
    if (h) { if (text) { h.dataset.was = h.dataset.was || h.textContent; h.textContent = text; } else if (h.dataset.was !== undefined) { h.textContent = h.dataset.was; } }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
