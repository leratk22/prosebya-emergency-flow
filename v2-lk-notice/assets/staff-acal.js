/* Просебя · кабинет сотрудников · «Календарь админа» (вид «Неделя»)
   Сетка собирается здесь из демо-данных: 08:00–21:30, шаг 30 минут, «сегодня» — понедельник 12.10.2026, 11:00.
   Клик по пустой ячейке открывает слот, по открытому — закрывает; недели переключаются, данные есть только у текущей. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var say = function (t) { if (window.staffSay) window.staffSay(t); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var START = 8 * 60, ROWS = 28, BASE = new Date(2026, 9, 12);
  var DAYS = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
  var rowOf = function (t) { var p = t.split(":"); return (+p[0] * 60 + +p[1] - START) / 30; };
  var hhmm = function (r) { var m = START + r * 30; return pad(Math.floor(m / 60)) + ":" + pad(m % 60); };
  var fmt = function (d) { return pad(d.getDate()) + "." + pad(d.getMonth() + 1); };

  var OPEN = { 0: ["14:00", "15:00", "16:00"], 1: ["10:00", "10:30", "11:00"], 2: ["14:00", "15:00"], 3: ["12:00", "12:30"], 4: ["10:00", "11:00", "16:00"], 5: ["12:00", "13:00"] };
  var NA = [{ day: 2, from: "12:00", rows: 3 }, { day: 6, from: "08:00", rows: 8 }];
  var EV = [
    { day: 0, time: "10:00", rows: 1, who: "Чурсина", phone: "+7 987 439-21-03", st: "Подтверждено" },
    { day: 0, time: "13:00", rows: 1, who: "Пятницын", phone: "+7 963 323-30-36", st: "Забронировано" },
    { day: 1, time: "15:00", rows: 2, who: "Шашков", phone: "+7 999 970-17-64", st: "Забронировано" },
    { day: 2, time: "10:00", rows: 1, who: "Чурсин", phone: "+7 927 200-72-57", st: "Забронировано" },
    { day: 3, time: "16:00", rows: 1, who: "Куликова", phone: "+7 981 806-04-41", st: "Забронировано" },
    { day: 4, time: "12:00", rows: 1, who: "Сергеева", phone: "+7 916 975-65-50", st: "Подтверждено" }
  ];
  var NOW = "11:00", week = 0;
  var open = {}; Object.keys(OPEN).forEach(function (d) { open[d] = OPEN[d].map(rowOf); });
  var inner = $(".agrid__inner");

  function dayDate(i) { var d = new Date(BASE); d.setDate(d.getDate() + week * 7 + i); return d; }
  function render() {
    var h = '<div class="agrid__head"><div class="agrid__corner"></div>';
    for (var i = 0; i < 7; i++) h += '<div class="agrid__day"><span>' + DAYS[i] + "</span><b>" + fmt(dayDate(i)) + "</b></div>";
    h += '</div><div class="agrid__body"><div class="agrid__times">';
    for (var r = 0; r < ROWS; r++) h += '<div class="agrid__t">' + hhmm(r) + "</div>";
    h += "</div>";
    for (var d = 0; d < 7; d++) {
      var cur = week === 0;
      h += '<div class="agrid__col' + (cur && d === 0 ? " is-today" : "") + '" data-day="' + d + '">';
      if (cur) {
        NA.forEach(function (n) { if (n.day === d) h += '<div class="ana" style="top:calc(' + rowOf(n.from) + " * var(--row));height:calc(" + n.rows + ' * var(--row))"></div>'; });
        (open[d] || []).forEach(function (row) { h += '<div class="aslot" data-row="' + row + '" style="top:calc(' + row + ' * var(--row));height:var(--row)"></div>'; });
        EV.forEach(function (e) {
          if (e.day === d) h += '<div class="ev" role="button" tabindex="0" style="top:calc(' + rowOf(e.time) + " * var(--row));height:calc(" + e.rows + ' * var(--row))"><b>' + e.time + " " + e.who + "</b><span>" + e.phone + '</span><span class="ev__st">' + e.st + "</span></div>";
        });
        if (d === 0) h += '<div class="anow" style="top:calc(' + rowOf(NOW) + ' * var(--row))"></div>';
      }
      h += "</div>";
    }
    inner.innerHTML = h + "</div>";
    $("[data-range]").textContent = fmt(dayDate(0)) + " – " + fmt(dayDate(6)) + "." + dayDate(6).getFullYear();
  }
  inner.addEventListener("click", function (e) {
    if (week !== 0 || e.target.closest(".ev") || e.target.closest(".ana")) return;
    var col = e.target.closest(".agrid__col"); if (!col) return;
    var d = +col.getAttribute("data-day"), rect = col.getBoundingClientRect();
    var row = Math.floor((e.clientY - rect.top) / (rect.height / ROWS)), list = open[d] || (open[d] = []), at = list.indexOf(row);
    if (at >= 0) list.splice(at, 1); else list.push(row);
    render();
  });
  $$("[data-week]").forEach(function (b) { b.addEventListener("click", function () { var s = +b.getAttribute("data-week"); week = s === 0 ? 0 : week + s; render(); }); });
  $$("[data-view]").forEach(function (b) { b.addEventListener("click", function () { if (b.getAttribute("data-view") !== "week") say("В демо сверстан только вид «Неделя»"); }); });
  $("[data-add]").addEventListener("click", function () { say("Создание сессии в демо не сверстано"); });
  $("[data-refresh]").addEventListener("click", function () { say("Календарь обновлён"); });
  var sync = $("[data-sync]");
  sync.addEventListener("click", function () {
    var on = sync.getAttribute("aria-pressed") !== "true"; sync.setAttribute("aria-pressed", on ? "true" : "false");
    $("span", sync).textContent = on ? "Синхронизация включена" : "Включить синхронизацию";
    say(on ? "Синхронизация включена" : "Синхронизация выключена");
  });
  $("[data-copy]").addEventListener("click", function () { say("Открытые слоты скопированы на " + $(".acal__period select").value.replace(" нед.", "") + " нед. вперёд"); });
  $("[data-clear]").addEventListener("click", function () { open = {}; render(); say("Неделя очищена"); });
  var toggles = $$("[data-slot-toggle]");
  toggles.forEach(function (t) { t.addEventListener("change", function () { toggles.forEach(function (o) { o.checked = t.checked; }); }); });

  render();
  var sc = $(".agrid__scroll"); if (sc && sc.scrollWidth > sc.clientWidth) sc.scrollLeft = 0;
})();
