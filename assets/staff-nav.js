/* Просебя · кабинет сотрудников · общая шапка и мобильное меню для страниц без календаря
   (клиенты, правка клиента, правка пользователя). Разметка шапки лежит в самих страницах.
   Параметры в адресе: ?menu=1 — открытое меню (на десктопе — меню пользователя),
   ?submenu=specialties | users — раскрытый раздел меню. Те же правила, что в staff.js. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var um = $("[data-user-menu]"), umBtn = $(".suser__btn", um);
  var dds = $$("[data-dd]"), accs = $$("[data-acc]");
  var drawer = $("[data-drawer]");
  function setUser(on) { um.classList.toggle("is-open", on); umBtn.setAttribute("aria-expanded", on ? "true" : "false"); }
  function setDd(g, on) { g.classList.toggle("is-open", on); $("button", g).setAttribute("aria-expanded", on ? "true" : "false"); }
  function closeAll() { setUser(false); dds.forEach(function (o) { setDd(o, false); }); }

  umBtn.addEventListener("click", function (e) { e.stopPropagation(); dds.forEach(function (o) { setDd(o, false); }); setUser(!um.classList.contains("is-open")); });
  dds.forEach(function (g) {
    $("button", g).addEventListener("click", function (e) {
      e.stopPropagation(); var on = !g.classList.contains("is-open");
      dds.forEach(function (o) { setDd(o, false); }); setUser(false); setDd(g, on);
    });
  });
  accs.forEach(function (g) { $("button", g).addEventListener("click", function () { setDd(g, !g.classList.contains("is-open")); }); });
  $("[data-open-menu]").addEventListener("click", function () { drawer.classList.add("is-open"); });
  $("[data-close-menu]").addEventListener("click", function () { drawer.classList.remove("is-open"); });
  document.addEventListener("click", closeAll);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAll(); drawer.classList.remove("is-open"); } });

  /* Уведомление внизу экрана */
  var toast = $("[data-toast]"), timer;
  window.staffSay = function (text) {
    if (!toast) return;
    toast.textContent = text; toast.classList.add("is-on");
    clearTimeout(timer); timer = setTimeout(function () { toast.classList.remove("is-on"); }, 2200);
  };

  var q = new URLSearchParams(location.search), desktop = window.matchMedia("(min-width: 1024px)").matches;
  if (q.get("menu") === "1") { if (desktop) setUser(true); else drawer.classList.add("is-open"); }
  var sub = q.get("submenu");
  if (sub) {
    if (desktop) dds.forEach(function (g) { setDd(g, g.getAttribute("data-dd") === sub); });
    else { drawer.classList.add("is-open"); accs.forEach(function (g) { setDd(g, g.getAttribute("data-acc") === sub); }); }
  }
})();
