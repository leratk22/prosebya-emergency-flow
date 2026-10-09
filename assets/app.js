/* Просебя · аварийный флоу · общая логика
   Страница задаёт раскладку атрибутами на <body>:
     data-layout="guest" | "app" | "specialist"
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
    calendarSmall:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.6" y="5" width="16.8" height="15.4" rx="2.3" stroke="currentColor" stroke-width="2"/><path d="M7.8 3.6v2.8M16.2 3.6v2.8M3.6 9.7h16.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  window.ICONS = ICONS;

  /* ---------- Данные ---------- */
  var MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  var WEEKDAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
  // «Сегодня» для макета: пятница, 9 октября 2026
  var TODAY = new Date(2026, 9, 9);

  function addDays(d, n) { var r = new Date(d); r.setDate(r.getDate() + n); return r; }
  function dateLabel(d) { return d.getDate() + " " + MONTHS[d.getMonth()]; }
  function dayLabel(offset) {
    /* как в макете: «9 октября  Сегодня», «10 октября  Завтра», дальше — только дата */
    var d = addDays(TODAY, offset);
    return { title: dateLabel(d), tag: offset === 0 ? "Сегодня" : offset === 1 ? "Завтра" : "" };
  }
  window.PS = { MONTHS: MONTHS, WEEKDAYS: WEEKDAYS, TODAY: TODAY, addDays: addDays, dateLabel: dateLabel, dayLabel: dayLabel };

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
    { id: 1, name: "Кузнецова Анна Сергеевна", day: 0, time: "18:00" },
    { id: 2, name: "Соколова Екатерина Владимировна", day: 0, time: "19:30" },
    { id: 3, name: "Петров Дмитрий Олегович", day: 0, time: "20:30" },
    { id: 4, name: "Иванов Максим Андреевич", day: 1, time: "10:00" },
    { id: 5, name: "Смирнова Ольга Игоревна", day: 1, time: "11:30" },
    { id: 6, name: "Попов Артём Евгеньевич", day: 1, time: "14:00" },
    { id: 7, name: "Васильева Мария Павловна", day: 2, time: "09:30" },
    { id: 8, name: "Морозов Илья Викторович", day: 3, time: "10:00" },
    { id: 9, name: "Новикова Наталья Алексеевна", day: 4, time: "12:00" },
    { id: 10, name: "Федоров Денис Станиславович", day: 5, time: "16:00" },
    { id: 11, name: "Захарова Елена Романовна", day: 6, time: "11:00" }
  ];
  window.SPECIALISTS = SPECIALISTS;

  function whenLabel(s) {
    var d = s.day === 0 ? "сегодня" : s.day === 1 ? "завтра" : dateLabel(addDays(TODAY, s.day));
    return "Запись на " + d + " " + s.time;
  }
  window.whenLabel = whenLabel;

  /* Слоты на 14 дней: [утро, день, вечер, ночь]. Сегодня — только вечер и ночь, дальше больше. */
  var COUNTS = [[0, 0, 2, 1], [3, 4, 3, 1], [3, 5, 3, 2], [4, 5, 4, 2], [4, 6, 4, 3], [4, 6, 5, 3], [5, 7, 5, 3],
    [5, 7, 5, 4], [5, 8, 6, 4], [6, 8, 6, 4], [6, 8, 7, 4], [6, 8, 7, 4], [6, 8, 8, 4], [6, 8, 8, 4]];
  var GROUPS = [
    { key: "morning", title: "Утро", from: 9 * 60, to: 11 * 60 + 30 },
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

  /* ---------- Каркас страницы ---------- */
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }

  function navItems(active, extraClass) {
    var items = [
      { id: "sessions", href: "sessions.html", icon: "calendar", label: "Мои сессии" },
      { id: "support", href: "mailto:service@prosebya.ru", icon: "chat", label: "Служба поддержки" }
    ];
    return items.map(function (i) {
      return '<a class="nav__item' + (i.id === active ? " is-active" : "") + '" href="' + i.href + '">' + ICONS[i.icon] + "<span>" + i.label + "</span></a>";
    }).join("");
  }

  function headerHtml(layout, user) {
    var logo = '<a class="site-header__logo" href="index.html" aria-label="Просебя"><img src="assets/logo.svg" alt="Просебя" width="93" height="26"></a>';
    if (layout === "guest") return '<header class="site-header">' + logo + "</header>";
    var userBlock = '<div class="user"><span class="user__avatar">' + ICONS.user + '</span><span class="user__name">' + user +
      '</span><a class="user__logout" href="auth.html" aria-label="Выйти">' + ICONS.logout + "</a></div>";
    if (layout === "specialist") {
      // у специалиста меню нет: имя и выход видны всегда
      return '<header class="site-header site-header--specialist">' + logo + userBlock.replace('class="user"', 'class="user user--always"') + "</header>";
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
    wrap.className = "layout layout--" + (layout === "app" ? "app" : layout === "specialist" ? "specialist" : "guest");
    if (layout === "app") {
      var side = el('<aside class="sidebar"><nav class="nav" aria-label="Меню">' + navItems(active) + "</nav>" +
        '<a class="btn btn--primary btn--sm sidebar__cta" href="specialties.html">Записаться на сессию</a></aside>');
      wrap.appendChild(side);
    }
    main.parentNode.insertBefore(wrap, main);
    wrap.appendChild(main);

    body.insertBefore(el(headerHtml(layout, user)), wrap);
    body.appendChild(el(footerHtml()));

    if (layout === "app") {
      var drawer = el('<div class="drawer" role="dialog" aria-modal="true" aria-label="Меню АЗ">' +
        '<div class="site-header"><a class="site-header__logo" href="index.html"><img src="assets/logo.svg" alt="Просебя" width="93" height="26"></a>' +
        '<button class="menu-btn menu-close" type="button" aria-label="Закрыть меню" data-menu-close></button></div>' +
        '<div class="drawer__user"><span class="user__avatar">' + ICONS.user + '</span><span class="drawer__name">' + user + "</span>" +
        '<a class="user__logout" href="auth.html" aria-label="Выйти">' + ICONS.logout + "</a></div>" +
        '<nav class="nav drawer__nav">' + navItems(active) + "</nav>" +
        '<div class="drawer__cta"><a class="btn btn--primary btn--l" href="specialties.html">Записаться на сессию</a></div></div>');
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
  window.showToast = function (text) {
    var t = document.querySelector(".toast");
    if (!t) { t = el('<div class="toast" role="alert"></div>'); document.body.appendChild(t); }
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
