/* Просебя · кабинет сотрудников · «Журнал действий» и «SMS-коды»
   Фильтры работают на демо-данных страницы: «Показать» применяет, «Сбросить» возвращает всё. Даты — дд.мм.гггг. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var say = function (t) { if (window.staffSay) window.staffSay(t); };
  var rows = $$(".lrow"), empty = $("[data-empty]"), count = $("[data-count]"), more = $("[data-more]");
  var log = $("[data-log-filters]"), sms = $("[data-sms-filters]"), total = sms ? "482" : "";

  function done(n, filtered) {
    empty.hidden = n > 0; more.hidden = filtered;
    count.textContent = filtered ? "Найдено: " + n : (sms ? "Показано 10 из 482" : "Показано 8 записей");
  }
  function iso(v) { var m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(v.trim()); return m ? m[3] + "-" + m[2] + "-" + m[1] : v.trim() ? "bad" : ""; }

  if (log) {
    var sels = $$("select", log), from = $("[data-from]", log), to = $("[data-to]", log);
    var TYPES = { "Слоты": "slots", "Записи": "rec", "Клиенты": "client" };
    log.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = iso(from.value), t = iso(to.value);
      if (f === "bad" || t === "bad") { say("Дата — в формате дд.мм.гггг"); return; }
      var type = TYPES[sels[0].value] || "", who = sels[1].value === "Все" ? "" : sels[1].value, n = 0;
      rows.forEach(function (r) {
        var d = r.getAttribute("data-date");
        var ok = (!type || r.getAttribute("data-type") === type) && (!who || r.getAttribute("data-who") === who) && (!f || d >= f) && (!t || d <= t);
        r.hidden = !ok; if (ok) n++;
      });
      done(n, !!(type || who || f || t));
    });
    log.addEventListener("reset", function () { setTimeout(function () { rows.forEach(function (r) { r.hidden = false; }); done(rows.length, false); }, 0); });
  }
  if (sms) {
    var phone = $("[data-phone]", sms);
    sms.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = phone.value.replace(/\D/g, ""), n = 0;
      rows.forEach(function (r) { var ok = !v || r.getAttribute("data-q").replace(/\D/g, "").indexOf(v) !== -1; r.hidden = !ok; if (ok) n++; });
      done(n, !!v);
    });
    sms.addEventListener("reset", function () { setTimeout(function () { rows.forEach(function (r) { r.hidden = false; }); done(rows.length, false); }, 0); });
  }
  more.addEventListener("click", function () { say(sms ? "В демо загружены 10 кодов из макета" : "В демо загружены 8 записей из макета"); });
})();
