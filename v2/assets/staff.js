/* Просебя · кабинет сотрудников · календарь недели
   Разметка шапки, меню и панели управления лежит в самих страницах (staff-*.html).
   Здесь: сетка недели, открытие/закрытие слотов, переключение недель, копирование и очистка, меню и список периодов.
   Параметры в адресе для просмотра состояний:  ?menu=1 — открытое меню (на десктопе — меню пользователя),
   ?period=1 — открытый список «1 нед. / 2 нед.». Данные демонстрационные. */
(function () {
  "use strict";

  var START_MIN = 8 * 60, ROWS = 22;            // 08:00 … 18:30, шаг 30 минут
  var DAYS = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
  var BASE = new Date(2026, 9, 5);              // понедельник текущей недели: 05.10.2026
  var TODAY_INDEX = 5;                          // подсвеченный день в макете: суббота, 10.10

  /* Сессии текущей недели: day 0..6, время начала, длительность в строках сетки */
  var EVENTS = [
    { day: 1, time: "13:00", rows: 1, who: "Чурсина", phone: "+79874392103", status: "Подтверждено", muted: true },
    { day: 3, time: "11:00", label: "11:15", rows: 2, who: "Шашков", phone: "+79999701764", status: "Забронировано", muted: true },
    { day: 5, time: "11:30", rows: 1, who: "Пятницын", phone: "+79633233036", status: "Забронировано", muted: true },
    { day: 5, time: "13:00", rows: 1, who: "Пятницын", phone: "+79633233036", status: "Проведено", muted: true },
    { day: 5, time: "18:00", rows: 1, who: "К", muted: true },
    { day: 6, time: "10:00", rows: 1, who: "Чурсин", phone: "+79272007257", status: "Забронировано" },
    { day: 6, time: "11:00", rows: 1, who: "Чурсин", phone: "+79272007257", status: "Забронировано" },
    { day: 6, time: "12:00", rows: 1, who: "Чурсина", phone: "+79874392103", status: "Подтверждено" },
    { day: 6, time: "13:00", rows: 1, who: "Чурсин", phone: "+79272007257", status: "Забронировано" }
  ];
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
      if (week === 0) {
        EVENTS.filter(function (e) { return e.day === d; }).forEach(function (e) {
          h += '<div class="ev' + (e.muted ? " is-muted" : "") + '" style="top:calc(' + rowOf(e.time) + " * var(--row));height:calc(" + (e.rows || 1) + ' * var(--row))">' +
            "<b>" + (e.label || e.time) + " " + esc(e.who) + "</b>" +
            (e.phone ? '<div class="ev__meta"><span>' + e.phone + "</span><span>" + e.status + "</span></div>" : "") + "</div>";
        });
      }
      h += "</div>";
    }
    h += "</div>";
    grid.innerHTML = h;
    $("[data-range]").textContent = fmtDay(weekDay(0)) + " – " + fmtDay(weekDay(6)) + "." + weekDay(6).getFullYear();
  }

  /* Слот: клик по пустой ячейке открывает его, по открытому — закрывает (создание сессии — отдельный экран) */
  grid.addEventListener("click", function (e) {
    if (e.target.closest(".ev")) return;
    var col = e.target.closest(".wgrid__col"); if (!col) return;
    var row = Math.floor((e.clientY - col.getBoundingClientRect().top) / (col.getBoundingClientRect().height / ROWS));
    var day = +col.getAttribute("data-day");
    open[week] = open[week] || {}; var list = open[week][day] = open[week][day] || [];
    var at = list.indexOf(row);
    if (at >= 0) list.splice(at, 1); else list.push(row);
    render();
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
  umBtn.addEventListener("click", function (e) { e.stopPropagation(); setUser(!um.classList.contains("is-open")); });
  var drawer = $("[data-drawer]");
  $("[data-open-menu]").addEventListener("click", function () { drawer.classList.add("is-open"); });
  $("[data-close-menu]").addEventListener("click", function () { drawer.classList.remove("is-open"); });
  document.addEventListener("click", function () { setSplit(false); setUser(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setSplit(false); setUser(false); drawer.classList.remove("is-open"); } });

  /* Переключатель «Запись по слотам» есть в двух местах (заголовок на десктопе, плашка на мобильном) — держим их в согласии */
  var toggles = $$("[data-slot-toggle]");
  toggles.forEach(function (t) { t.addEventListener("change", function () { toggles.forEach(function (o) { o.checked = t.checked; }); }); });

  render();
  var sc = $(".wgrid__scroll");
  if (sc && sc.scrollWidth > sc.clientWidth) sc.scrollLeft = sc.scrollWidth;   // на телефоне сразу показываем конец недели (сб–вс)

  var q = new URLSearchParams(location.search);
  if (q.get("menu") === "1") { if (window.matchMedia("(min-width: 1024px)").matches) setUser(true); else drawer.classList.add("is-open"); }
  if (q.get("period") === "1") setSplit(true);
})();
