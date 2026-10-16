/* Просебя · кабинет сотрудников · календарь недели
   Разметка шапки, меню и панели управления лежит в самих страницах (staff-*.html).
   Здесь: сетка недели, открытие/закрытие слотов, переключение недель, копирование и очистка, меню и список периодов.
   Параметры в адресе для просмотра состояний:  ?menu=1 — открытое меню (на десктопе — меню пользователя),
   ?period=1 — открытый список «1 нед. / 2 нед.», ?popup=1 — открытая карточка сессии, ?popup=reschedule — она же с раскрытым переносом.
   Данные демонстрационные. */
(function () {
  "use strict";

  var START_MIN = 8 * 60, ROWS = 22;            // 08:00 … 18:30, шаг 30 минут
  var DAYS = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
  var BASE = new Date(2026, 9, 5);              // понедельник текущей недели: 05.10.2026
  var TODAY_INDEX = 5;                          // подсвеченный день в макете: суббота, 10.10

  /* Сессии текущей недели: day 0..6, время начала, длительность в строках сетки */
  var EVENTS = [
    { day: 1, time: "13:00", rows: 1, who: "Чурсина", name: "Чурсина Анна", phone: "+79874392103", email: "chursina@example.com", status: "Подтверждено", muted: true },
    { day: 3, time: "11:00", label: "11:15", rows: 2, who: "Шашков", name: "Шашков Павел", phone: "+79999701764", email: "shashkov@example.com", status: "Забронировано", muted: true },
    { day: 5, time: "11:30", rows: 1, who: "Пятницын", name: "Пятницын Олег", phone: "+79633233036", email: "pyatnitsyn@example.com", status: "Забронировано", muted: true },
    { day: 5, time: "13:00", rows: 1, who: "Пятницын", name: "Пятницын Олег", phone: "+79633233036", email: "pyatnitsyn@example.com", status: "Проведено", muted: true },
    { day: 5, time: "18:00", rows: 1, who: "К", name: "К", status: "Забронировано", muted: true },
    { day: 6, time: "10:00", rows: 1, who: "Чурсин", name: "Чурсин Иван", phone: "+79272007257", email: "chursin@example.com", status: "Забронировано" },
    { day: 6, time: "11:00", rows: 1, who: "Чурсин", name: "Чурсин Иван", phone: "+79272007257", email: "chursin@example.com", status: "Забронировано" },
    { day: 6, time: "12:00", rows: 1, who: "Чурсина", name: "Чурсина Анна", phone: "+79874392103", email: "chursina@example.com", status: "Подтверждено" },
    { day: 6, time: "13:00", rows: 1, who: "Чурсин", name: "Чурсин Иван", phone: "+79272007257", email: "chursin@example.com", status: "Забронировано" }
  ];
  var STATUSES = ["Забронировано", "Подтверждено", "Проведено"];
  var SPECIALTY = "Психолог", SPECIALIST = "Тест Специалист", TZ = "UTC+3 (Europe/Moscow)";
  /* Открытые слоты (неделя → день → индексы строк). Начальные — как в макете, остальное меняет пользователь. */
  function rowOf(t) { var p = t.split(":"); return (+p[0] * 60 + +p[1] - START_MIN) / 30; }
  var open = { 0: { 5: ["10:00", "14:00", "15:00", "16:00", "17:00"].map(rowOf), 6: ["10:30", "14:00", "15:00", "16:00", "17:00", "18:00"].map(rowOf) } };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var fmtDay = function (d) { return pad(d.getDate()) + "." + pad(d.getMonth() + 1); };

  var week = 0, weeksToCopy = 1;
  var grid = $("[data-grid] .wgrid__inner");

  function weekDay(i) { var d = new Date(BASE); d.setDate(d.getDate() + week * 7 + i); return d; }
  function hhmm(row) { var m = START_MIN + row * 30; return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function render() {
    var h = '<div class="wgrid__head"><div class="wgrid__corner"></div>';
    for (var i = 0; i < 7; i++) {
      h += '<div class="wgrid__day' + (week === 0 && i === TODAY_INDEX ? " is-today" : "") + '"><span>' + DAYS[i] + "</span><b>" + fmtDay(weekDay(i)) + "</b></div>";
    }
    h += '</div><div class="wgrid__body"><div class="wgrid__times">';
    for (var r = 0; r < ROWS; r++) h += '<div class="wgrid__t">' + hhmm(r) + "</div>";
    h += "</div>";
    for (var d = 0; d < 7; d++) {
      h += '<div class="wgrid__col' + (week === 0 && d === TODAY_INDEX ? " is-today" : "") + '" data-day="' + d + '">';
      ((open[week] || {})[d] || []).forEach(function (row) {
        h += '<div class="wslot" data-row="' + row + '" style="top:calc(' + row + ' * var(--row))"></div>';
      });
      EVENTS.forEach(function (e, i) {
        if ((e.week || 0) === week && e.day === d) {
          h += '<div class="ev' + (e.muted ? " is-muted" : "") + '" role="button" tabindex="0" data-ev="' + i + '" style="top:calc(' + rowOf(e.time) + " * var(--row));height:calc(" + (e.rows || 1) + ' * var(--row))">' +
            "<b>" + (e.label || e.time) + " " + esc(e.who) + "</b>" +
            (e.phone ? '<div class="ev__meta"><span>' + e.phone + "</span><span>" + e.status + "</span></div>" : "") + "</div>";
        }
      });
      h += "</div>";
    }
    h += "</div>";
    grid.innerHTML = h;
    $("[data-range]").textContent = fmtDay(weekDay(0)) + " – " + fmtDay(weekDay(6)) + "." + weekDay(6).getFullYear();
  }

  /* Слот: клик по пустой ячейке открывает его, по открытому — закрывает (создание сессии — отдельный экран) */
  grid.addEventListener("click", function (e) {
    var evEl = e.target.closest(".ev");
    if (evEl) { openPop(+evEl.getAttribute("data-ev")); return; }
    var col = e.target.closest(".wgrid__col"); if (!col) return;
    var row = Math.floor((e.clientY - col.getBoundingClientRect().top) / (col.getBoundingClientRect().height / ROWS));
    var day = +col.getAttribute("data-day");
    open[week] = open[week] || {}; var list = open[week][day] = open[week][day] || [];
    var at = list.indexOf(row);
    if (at >= 0) list.splice(at, 1); else list.push(row);
    render();
  });

  grid.addEventListener("keydown", function (e) {
    var evEl = e.target.closest && e.target.closest(".ev");
    if (evEl && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openPop(+evEl.getAttribute("data-ev")); }
  });

  /* Недели */
  $$("[data-week]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = +b.getAttribute("data-week");
      week = v === 0 ? 0 : week + v;
      render();
    });
  });

  /* Копировать / очистить */
  var toast = $("[data-toast]"), toastTimer;
  function say(text) { toast.textContent = text; toast.classList.add("is-on"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 2200); }
  $("[data-copy]").addEventListener("click", function () {
    var src = open[week] || {};
    for (var w = 1; w <= weeksToCopy; w++) {
      var dst = open[week + w] = {};
      Object.keys(src).forEach(function (d) { dst[d] = src[d].slice(); });
    }
    say("Неделя скопирована на " + weeksToCopy + " нед.");
  });
  $("[data-clear]").addEventListener("click", function () { open[week] = {}; render(); say("Неделя очищена"); });

  /* Список периода */
  var split = $("[data-split]"), splitBtn = $(".split__toggle", split);
  function setSplit(on) { split.classList.toggle("is-open", on); splitBtn.setAttribute("aria-expanded", on ? "true" : "false"); }
  splitBtn.addEventListener("click", function (e) { e.stopPropagation(); setSplit(!split.classList.contains("is-open")); });
  $$(".pmenu__opt", split).forEach(function (o) {
    function pick() {
      weeksToCopy = +o.getAttribute("data-weeks");
      $$(".pmenu__opt", split).forEach(function (x) { x.setAttribute("aria-selected", x === o ? "true" : "false"); });
      $("[data-period-label]").textContent = weeksToCopy + " нед.";
      setSplit(false);
    }
    o.addEventListener("click", pick);
    o.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
  });

  /* Меню пользователя (десктоп) и мобильное меню */
  var um = $("[data-user-menu]"), umBtn = $(".suser__btn", um);
  function setUser(on) { um.classList.toggle("is-open", on); umBtn.setAttribute("aria-expanded", on ? "true" : "false"); }
  umBtn.addEventListener("click", function (e) { e.stopPropagation(); dds.forEach(function (o) { setDd(o, false); }); setUser(!um.classList.contains("is-open")); });
  /* Выпадающие разделы шапки (десктоп) и раскрывающиеся пункты мобильного меню (только админ) */
  var dds = $$("[data-dd]"), accs = $$("[data-acc]");
  function setDd(g, on) { g.classList.toggle("is-open", on); $("button", g).setAttribute("aria-expanded", on ? "true" : "false"); }
  dds.forEach(function (g) {
    $("button", g).addEventListener("click", function (e) {
      e.stopPropagation(); var on = !g.classList.contains("is-open");
      dds.forEach(function (o) { setDd(o, false); }); setUser(false); setSplit(false); setDd(g, on);
    });
  });
  accs.forEach(function (g) { $("button", g).addEventListener("click", function () { setDd(g, !g.classList.contains("is-open")); }); });
  var drawer = $("[data-drawer]");
  $("[data-open-menu]").addEventListener("click", function () { drawer.classList.add("is-open"); });
  $("[data-close-menu]").addEventListener("click", function () { drawer.classList.remove("is-open"); });
  document.addEventListener("click", function () { setSplit(false); setUser(false); dds.forEach(function (o) { setDd(o, false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setSplit(false); setUser(false); dds.forEach(function (o) { setDd(o, false); }); drawer.classList.remove("is-open"); } });

  /* ---------- Карточка сессии (клик по сессии в сетке) ---------- */
  var ICON_X = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>';
  var ICON_COPY = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var ICON_SWAP = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 5.5h10M10 3l2.5 2.5L10 8M13.5 10.5h-10M6 8l-2.5 2.5L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_BAN = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M3.8 3.8l8.4 8.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var ICON_CARET = '<svg class="select__caret" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var WEEKDAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

  var pop = document.createElement("div");
  pop.className = "spop"; pop.hidden = true;
  document.body.appendChild(pop);
  var cur = null;   // { i: индекс сессии, resched: раскрыт ли перенос, confirm: спрашиваем ли про отмену, slots, pick }

  function dateOf(w, d) { var x = new Date(BASE); x.setDate(x.getDate() + w * 7 + d); return x; }
  function fmtFull(x) { return fmtDay(x) + "." + x.getFullYear(); }
  /* Ссылка на видеовстречу: у каждой сессии своя, подставляем стабильный «хэш» */
  function linkOf(e) {
    var h = 7; String(e.who + e.time + e.day).split("").forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) >>> 0; });
    var out = "";
    for (var k = 0; k < 32; k++) { h = (Math.imul(h, 1103515245) + 12345) >>> 0; out += ((h >>> 16) & 15).toString(16); }
    return "calls.prosebya.ru/session-" + out;
  }
  /* Свободные открытые слоты на 14 дней вперёд: открытые, не занятые другой сессией, не раньше «сегодня» */
  function freeSlots(self) {
    var res = [];
    for (var w = 0; w <= 1; w++) {
      for (var d = 0; d < 7; d++) {
        if (w === 0 && d < TODAY_INDEX) continue;
        var rows = ((open[w] || {})[d] || []).filter(function (r) {
          return !EVENTS.some(function (o) {
            if (o === self || (o.week || 0) !== w || o.day !== d) return false;
            var from = rowOf(o.time); return r >= from && r < from + (o.rows || 1);
          });
        }).sort(function (a, b) { return a - b; });
        if (rows.length) res.push({ w: w, d: d, rows: rows });
      }
    }
    return res;
  }

  function sel(name, label, opts, disabled) {
    return '<label class="select"><span class="select__label">' + label + '</span><select data-f="' + name + '"' + (disabled ? " disabled" : "") + ">" + opts + "</select>" + ICON_CARET + "</label>";
  }
  function opt(v, t, on) { return '<option value="' + esc(v) + '"' + (on ? " selected" : "") + ">" + esc(t) + "</option>"; }
  function timeOpts() {
    var s = cur.slots[cur.pick.date];
    return s ? s.rows.map(function (r) { return opt(r, hhmm(r), r === cur.pick.row); }).join("") : opt("", "—");
  }
  function infoRow(label, val) { return '<div class="spop__row"><dt>' + label + "</dt><dd>" + val + "</dd></div>"; }

  function popHtml() {
    var e = EVENTS[cur.i], w = e.week || 0, x = dateOf(w, e.day), link = linkOf(e);
    var html = '<div class="spop__card" role="dialog" aria-modal="true" aria-labelledby="spop-title" tabindex="-1">' +
      '<div class="spop__head"><div class="spop__titles"><h2 id="spop-title">Сессия ' + fmtFull(x) + " " + (e.label || e.time) + "</h2><p>" + TZ + "</p></div>" +
      '<button class="spop__close" type="button" aria-label="Закрыть" data-pop-close>' + ICON_X + "</button></div>" +
      '<div class="spop__body"><dl class="spop__info">' +
      infoRow("Специальность", SPECIALTY) + infoRow("Специалист", SPECIALIST) + infoRow("Клиент", esc(e.name || e.who)) +
      infoRow("Номер телефона", esc(e.phone || "—")) + infoRow("Эл. почта", esc(e.email || "—")) +
      infoRow("Видеовстреча", '<span class="spop__link"><a href="https://' + link + '" target="_blank" rel="noopener" title="https://' + link + '">' + link + "</a>" +
        '<button class="spop__copy" type="button" aria-label="Скопировать ссылку" data-pop-copy>' + ICON_COPY + "</button></span>") +
      "</dl>" +
      '<div class="spop__status">' + sel("status", "Статус", STATUSES.map(function (s) { return opt(s, s, s === e.status); }).join("")) +
      '<button class="spop__btn" type="button" data-pop-save>Сохранить</button></div>';
    if (cur.confirm) {
      html += '<div class="spop__confirm"><p>Отменить сессию? Клиент получит уведомление, время освободится.</p>' +
        '<div class="spop__actions"><button class="btn-danger" type="button" data-pop-cancel-yes>' + ICON_BAN + "<span>Да, отменить</span></button>" +
        '<button class="spop__btn" type="button" data-pop-cancel-no>Не отменять</button></div></div>';
    } else {
      html += '<div class="spop__actions"><button class="spop__btn' + (cur.resched ? " is-on" : "") + '" type="button" aria-expanded="' + cur.resched + '" data-pop-resched>' + ICON_SWAP + "<span>Перенести</span></button>" +
        '<button class="btn-danger" type="button" data-pop-cancel>' + ICON_BAN + "<span>Отменить сессию</span></button></div>";
    }
    if (cur.resched && !cur.confirm) {
      var has = cur.slots.length > 0;
      html += '<div class="spop__resched"><div class="spop__pair">' + sel("specialty", "Специальность", opt(SPECIALTY, SPECIALTY, true)) + sel("specialist", "Специалист", opt(SPECIALIST, SPECIALIST, true)) + "</div>" +
        '<div class="spop__pair spop__pair--dt">' +
        sel("date", "Дата", has ? cur.slots.map(function (s, k) { var d = dateOf(s.w, s.d); return opt(k, fmtFull(d) + ", " + WEEKDAYS[s.d], k === cur.pick.date); }).join("") : opt("", "Нет свободных слотов"), !has) +
        sel("time", "Время", has ? timeOpts() : opt("", "—"), !has) + "</div>" +
        '<p class="spop__note">время специалиста: ' + TZ + "</p>" +
        '<div class="field"><div class="field__box"><div class="field__body"><label class="field__label" for="spop-reason">Причина переноса (необязательно)</label><input class="field__input" id="spop-reason" data-f="reason" placeholder="Причина переноса (необязательно)" maxlength="500" autocomplete="off"></div></div>' +
        '<div class="field__helper">Только свободные открытые слоты. Клиент получит уведомление, ссылка на встречу сохранится.</div></div>' +
        '<button class="btn btn--primary btn--l" type="button" data-pop-move' + (has ? "" : " disabled") + ">Перенести на выбранное время</button></div>";
    }
    return html + "</div></div>";
  }

  function paint(keepFocus) {
    var reason = $('[data-f="reason"]', pop), keep = reason ? reason.value : "";
    pop.innerHTML = popHtml();
    reason = $('[data-f="reason"]', pop); if (reason) reason.value = keep;
    if (keepFocus) { var f = $(keepFocus, pop); if (f) f.focus(); }
  }

  function openPop(i, resched) {
    var e = EVENTS[i]; if (!e) return;
    var slots = freeSlots(e);
    cur = { i: i, resched: !!resched, confirm: false, slots: slots, pick: { date: 0, row: slots.length ? slots[0].rows[0] : null } };
    paint(); pop.hidden = false; pop.classList.add("is-open"); document.body.style.overflow = "hidden";
    $(".spop__card", pop).focus();
  }
  function closePop() {
    if (!cur) return;
    var i = cur.i; cur = null;
    pop.classList.remove("is-open"); pop.hidden = true; pop.innerHTML = ""; document.body.style.overflow = "";
    var el = $('[data-ev="' + i + '"]'); if (el) el.focus();
  }

  pop.addEventListener("click", function (e) {
    if (!cur) return;
    var t = e.target;
    if (t === pop || t.closest("[data-pop-close]")) { closePop(); return; }
    var ev = EVENTS[cur.i];
    if (t.closest("[data-pop-copy]")) {
      var url = "https://" + linkOf(ev);
      try { navigator.clipboard.writeText(url); } catch (err) { /* нет доступа к буферу — просто сообщаем */ }
      say("Ссылка скопирована"); return;
    }
    if (t.closest("[data-pop-save]")) { ev.status = $('[data-f="status"]', pop).value; render(); say("Статус сохранён"); return; }
    if (t.closest("[data-pop-resched]")) { cur.resched = !cur.resched; paint("[data-pop-resched]"); if (cur.resched) $(".spop__resched", pop).scrollIntoView({ block: "nearest", behavior: "smooth" }); return; }
    if (t.closest("[data-pop-cancel]")) { cur.confirm = true; paint("[data-pop-cancel-no]"); return; }
    if (t.closest("[data-pop-cancel-no]")) { cur.confirm = false; paint("[data-pop-cancel]"); return; }
    if (t.closest("[data-pop-cancel-yes]")) { EVENTS.splice(cur.i, 1); cur.i = -1; closePop(); render(); say("Сессия отменена"); return; }
    if (t.closest("[data-pop-move]")) {
      var s = cur.slots[cur.pick.date]; if (!s || cur.pick.row == null) return;
      var list = open[s.w][s.d], at = list.indexOf(cur.pick.row); if (at >= 0) list.splice(at, 1);   // занятый слот перестаёт быть открытым
      ev.week = s.w; ev.day = s.d; ev.time = hhmm(cur.pick.row); delete ev.label;
      var when = fmtDay(dateOf(s.w, s.d)) + " в " + ev.time;
      closePop(); render(); say("Сессия перенесена на " + when);
    }
  });
  pop.addEventListener("change", function (e) {
    if (!cur) return;
    var f = e.target.getAttribute("data-f");
    if (f === "date") {
      cur.pick.date = +e.target.value; cur.pick.row = cur.slots[cur.pick.date].rows[0];
      $('[data-f="time"]', pop).innerHTML = timeOpts();
    } else if (f === "time") { cur.pick.row = +e.target.value; }
  });
  document.addEventListener("keydown", function (e) {
    if (!cur) return;
    if (e.key === "Escape") { closePop(); return; }
    if (e.key !== "Tab") return;
    var f = $$("button:not([disabled]), select:not([disabled]), input, a[href]", pop);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === $(".spop__card", pop))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* Переключатель «Запись по слотам» есть в двух местах (заголовок на десктопе, плашка на мобильном) — держим их в согласии */
  var toggles = $$("[data-slot-toggle]");
  toggles.forEach(function (t) { t.addEventListener("change", function () { toggles.forEach(function (o) { o.checked = t.checked; }); }); });

  render();
  var sc = $(".wgrid__scroll");
  if (sc && sc.scrollWidth > sc.clientWidth) sc.scrollLeft = sc.scrollWidth;   // на телефоне сразу показываем конец недели (сб–вс)

  var q = new URLSearchParams(location.search);
  if (q.get("menu") === "1") { if (window.matchMedia("(min-width: 1024px)").matches) setUser(true); else drawer.classList.add("is-open"); }
  if (q.get("period") === "1") setSplit(true);
  if (q.get("popup")) openPop(7, q.get("popup") === "reschedule");
  var sub = q.get("submenu");   // ?submenu=specialties | users — раскрыть раздел (и мобильное меню)
  if (sub) {
    if (window.matchMedia("(min-width: 1024px)").matches) dds.forEach(function (g) { setDd(g, g.getAttribute("data-dd") === sub); });
    else { drawer.classList.add("is-open"); accs.forEach(function (g) { setDd(g, g.getAttribute("data-acc") === sub); }); }
  }
})();
