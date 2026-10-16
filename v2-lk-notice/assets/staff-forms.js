/* Просебя · кабинет сотрудников · списки и формы
   Клиенты: поиск по имени, телефону и почте. Клиент: ?id=4 — правка (в демо записи есть только у Насти Чурсиной), ?new=1 — новый.
   Пользователь: копирование ссылок, чипы специальностей, показ пароля. Данные демонстрационные. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var say = function (t) { if (window.staffSay) window.staffSay(t); };
  var role = document.body.getAttribute("data-role");
  var q = new URLSearchParams(location.search);

  /* ---------- Клиенты: поиск ---------- */
  var search = $("[data-search]");
  if (search) {
    var rows = $$(".crow"), empty = $("[data-empty]"), count = $("[data-count]"), more = $("[data-more]");
    var desktop = window.matchMedia("(min-width: 1024px)");
    function hint() { search.placeholder = desktop.matches ? "Поиск по имени, телефону или почте" : "Имя, телефон или почта"; }
    hint(); (desktop.addEventListener ? desktop.addEventListener("change", hint) : desktop.addListener(hint));
    search.addEventListener("input", function () {
      var v = search.value.trim().toLowerCase(), n = 0;
      rows.forEach(function (r) { var ok = !v || r.getAttribute("data-q").indexOf(v) !== -1; r.hidden = !ok; if (ok) n++; });
      empty.hidden = n > 0;
      count.textContent = v ? "Найдено: " + n : "Показано 8 из 124";
      more.hidden = !!v;
    });
    more.addEventListener("click", function () { say("В демо загружены 8 клиентов из макета"); });
  }

  /* ---------- Клиент: правка или новый ---------- */
  var cform = $("[data-client-form]");
  if (cform) {
    var LIST = [
      ["Тестовый Фёдор", "", "+7 999 716-06-35"], ["Lera Tkacheva", "leratk22@gmail.com", "+7 960 990-01-11"], ["Аня Куликова", "akulikova@prosebya.ru", "+7 981 806-04-41"],
      ["Lefhl Afasdf", "", "+7 963 234-34-34"], ["Настя Чурсина", "", "+7 987 439-21-03"], ["София Сергеева", "", "+7 916 975-65-50"],
      ["Анастас Чурсин", "", "+7 927 200-72-57"], ["Аня Пользователева", "", "+7 900 651-75-66"]
    ];
    var id = q.get("new") === "1" ? -1 : (q.get("id") == null ? 4 : +q.get("id")), c = LIST[id];
    var recs = $("[data-recs]"), tpl = $("[data-recs-list]");
    function setVal(name, v) { var el = $("#" + name, cform); if (el) el.value = v; }
    if (c) {
      var p = c[0].split(" ");
      $("[data-title]").textContent = c[0]; $("[data-sub]").textContent = c[2];
      document.title = c[0] + " · Просебя";
      setVal("first", p[0]); setVal("last", p.slice(1).join(" ")); setVal("email", c[1]); setVal("phone", c[2]); setVal("promo", "Нет");
      var tz = $$("select", cform)[1]; if (id === 4) tz.value = "Самара (UTC+4)";
      $("[data-delete]").hidden = false;
      if (id === 4) {
        recs.innerHTML = '<h2 class="recs__title">Записи <span>7</span></h2>' + tpl.innerHTML;
      } else {
        recs.innerHTML = '<h2 class="recs__title">Записи</h2>' + emptyRecs();
      }
    } else {
      recs.innerHTML = '<h2 class="recs__title">Записи</h2>' + emptyRecs();
    }
    function emptyRecs() {
      return '<div class="recs__empty"><span class="recs__icon"><svg viewBox="0 0 24 24" fill="none" width="24" height="24" aria-hidden="true"><rect x="3.6" y="5" width="16.8" height="15.4" rx="2.33" stroke="currentColor" stroke-width="1.75"/><path d="M7.8 3.6V6.4M16.2 3.6V6.4M3.6 9.67H20.4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg></span><b>Записей пока нет</b><span>Они появятся здесь после первой записи клиента.</span></div>';
    }
    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!$("#first").value.trim() || !$("#phone").value.trim()) { say("Укажите имя и телефон"); (!$("#first").value.trim() ? $("#first") : $("#phone")).focus(); return; }
      say("Клиент сохранён"); setTimeout(function () { location.href = "staff-clients-" + role + ".html"; }, 700);
    });
    $("[data-delete]").addEventListener("click", function () {
      if (window.confirm("Удалить клиента? Это действие нельзя отменить.")) { say("Клиент удалён"); setTimeout(function () { location.href = "staff-clients-" + role + ".html"; }, 700); }
    });
  }

  /* ---------- Пользователь ---------- */
  var uform = $("[data-user-form]");
  if (uform) {
    $$("[data-copy-link]").forEach(function (b) {
      b.addEventListener("click", function () {
        var url = new URL(b.getAttribute("data-copy-link"), location.href).href, label = $("span", b), was = label.textContent;
        function done() { b.classList.add("is-copied"); label.textContent = "Ссылка скопирована"; setTimeout(function () { b.classList.remove("is-copied"); label.textContent = was; }, 1600); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done); else done();
      });
    });
    $$("[data-eye]").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = $("input", b.closest(".field__box")), on = i.type === "password";
        i.type = on ? "text" : "password"; b.setAttribute("aria-label", on ? "Скрыть пароль" : "Показать пароль");
      });
    });
    var chips = $("[data-chips]");
    chips.addEventListener("click", function (e) { var x = e.target.closest("[data-chip-x]"); if (x) x.closest(".fchip").remove(); });
    $("[data-spec-add]").addEventListener("change", function (e) {
      var v = e.target.value; if (!v) return;
      var have = $$(".fchip > span", chips).some(function (s) { return s.textContent === v; });
      if (!have) {
        var c = document.createElement("span"); c.className = "fchip";
        c.innerHTML = "<span></span><button type=\"button\" aria-label=\"Убрать\" data-chip-x><svg viewBox=\"0 0 12 12\" fill=\"none\" aria-hidden=\"true\"><path d=\"M3 3l6 6M9 3l-6 6\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></button>";
        c.firstChild.textContent = v; c.querySelector("button").setAttribute("aria-label", "Убрать «" + v + "»");
        chips.insertBefore(c, $(".fpill", chips));
      }
      e.target.value = "";
    });
    uform.addEventListener("submit", function (e) {
      e.preventDefault();
      var a = $("#pass").value, b = $("#pass2").value;
      if (a !== b) { say("Пароли не совпадают"); $("#pass2").focus(); return; }
      say("Изменения сохранены");
    });
  }
})();
