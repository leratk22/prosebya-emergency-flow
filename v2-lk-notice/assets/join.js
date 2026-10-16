/* Просебя · регистрация специалиста
   Проверки и тексты ошибок взяты из исходной системы (Easy!Appointments, страница «Регистрация специалиста»; там они выводятся сводкой над формой, у нас — под полями):
   фамилия и имя, корректная почта и телефон, специальность, логин (латиница/цифры/_ @ . -, не короче 3; пустой — та же ошибка), пароль не короче 7, пароли совпадают.
   «Логин уже занят» и «пароли не совпадают» — тексты из файла переводов; занятые логины в макете: admin, ivanova (проверка «сервера» при отправке).
   Состояния: ?state=errors — ошибки как на макете, ?state=open — открытый список, ?demo=many — в списке больше пунктов. */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var form = $("#join-form"), submit = $("#submit");
  var field = function (k) { return $('[data-field="' + k + '"]'); };
  var input = function (k) { return $("input:not([type=hidden]):not([type=search])", field(k)); };
  var TAKEN = ["admin", "ivanova"];

  /* ---------- Список специальностей ---------- */
  var SERVICES = [{ id: "1", title: "Service" }, { id: "3", title: "Зоо психолог" }, { id: "2", title: "Психолог" }];
  if (qs("demo") === "many") {
    ["Семейный психолог", "Детский и подростковый психолог", "Коуч", "Психотерапевт", "Юрист", "Фитнес-тренер"].forEach(function (t, i) { SERVICES.push({ id: String(10 + i), title: t }); });
  }
  var CHECK = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var svc = field("service"), box = $("#service-box"), list = $("#service-list"), search = $("#service-search"), view = $("#service-view"), hidden = $("#service-value");
  var selected = null, active = -1, shown = SERVICES;

  function renderList(filter) {
    var f = (filter || "").trim().toLowerCase();
    shown = SERVICES.filter(function (s) { return !f || s.title.toLowerCase().indexOf(f) !== -1; });
    list.innerHTML = shown.length ? shown.map(function (s, i) {
      return '<li class="combo__opt" role="option" id="svc-' + s.id + '" data-id="' + s.id + '" aria-selected="' + (selected === s.id) + '"><span>' + s.title + "</span>" + CHECK + "</li>";
    }).join("") : '<li class="combo__empty">Ничего не найдено</li>';
    active = -1;
  }
  function setActive(i) {
    var opts = list.querySelectorAll(".combo__opt");
    if (!opts.length) return;
    active = (i + opts.length) % opts.length;
    opts.forEach(function (o, k) { o.classList.toggle("is-active", k === active); });
    opts[active].scrollIntoView({ block: "nearest" });
  }
  function open(on) {
    svc.classList.toggle("is-open", on);
    box.setAttribute("aria-expanded", String(on));
    if (on) {
      $("#service-search-wrap").hidden = SERVICES.length <= 6;   /* поиск нужен, только когда пунктов много */
      search.value = ""; renderList("");
      if (SERVICES.length > 6) search.focus();
    } else if (!selected) { show("service"); }
  }
  function choose(id) {
    var s = SERVICES.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    selected = s.id; hidden.value = s.id; view.value = s.title;
    open(false); box.focus(); show("service"); refresh();
  }
  box.addEventListener("click", function () { open(!svc.classList.contains("is-open")); });
  box.addEventListener("keydown", function (e) {
    var isOpen = svc.classList.contains("is-open");
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); if (!isOpen) { open(true); setActive(0); } else if (e.key === "ArrowDown") setActive(active + 1); else if (active >= 0) choose(shown[active].id); }
    else if (e.key === "ArrowUp" && isOpen) { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Escape") open(false);
  });
  search.addEventListener("input", function () { renderList(search.value); });
  search.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Enter") { e.preventDefault(); if (active < 0) active = 0; if (shown[active]) choose(shown[active].id); }
    else if (e.key === "Escape") { open(false); box.focus(); }
  });
  list.addEventListener("click", function (e) { var o = e.target.closest(".combo__opt"); if (o) choose(o.getAttribute("data-id")); });
  document.addEventListener("click", function (e) { if (svc.classList.contains("is-open") && !svc.contains(e.target)) open(false); });

  /* ---------- Телефон ---------- */
  var phone = input("phone_number");
  function digits() { return phone.value.replace(/\D/g, "").replace(/^[78](?=\d{10})/, "").slice(0, 10); }
  function fmtPhone(d) {
    var o = d.slice(0, 3);
    if (d.length > 3) o += " " + d.slice(3, 6);
    if (d.length > 6) o += "-" + d.slice(6, 8);
    if (d.length > 8) o += "-" + d.slice(8, 10);
    return o;
  }
  phone.addEventListener("input", function () { phone.value = fmtPhone(digits()); });

  /* ---------- Показ пароля ---------- */
  var EYE = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M1.8 10S4.6 4.5 10 4.5 18.2 10 18.2 10 15.4 15.5 10 15.5 1.8 10 1.8 10z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="10" cy="10" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>';
  var EYE_OFF = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M1.8 10S4.6 4.5 10 4.5c1.2 0 2.3.3 3.3.7M18.2 10s-2.8 5.5-8.2 5.5c-1.2 0-2.3-.3-3.3-.7M8.2 8.2a2.4 2.4 0 003.6 3.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 3l14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  Array.prototype.forEach.call(form.querySelectorAll("[data-eye]"), function (b) {
    var inp = document.getElementById(b.getAttribute("data-eye"));
    b.innerHTML = EYE;
    b.addEventListener("click", function () {
      var show = inp.type === "password";
      inp.type = show ? "text" : "password";
      b.innerHTML = show ? EYE_OFF : EYE;
      b.setAttribute("aria-label", show ? "Скрыть пароль" : "Показать пароль");
    });
  });

  /* ---------- Проверки: возвращают текст ошибки или пустую строку ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, LOGIN = /^[A-Za-z0-9_@.\-]{3,}$/;
  var rules = {
    last_name: function (v) { return v.trim() ? "" : "Укажите фамилию"; },
    first_name: function (v) { return v.trim() ? "" : "Укажите имя"; },
    email: function (v) { return !v.trim() ? "Укажите корректную эл. почту" : EMAIL.test(v.trim()) ? "" : "Укажите корректную эл. почту"; },
    phone_number: function () { var d = digits(); return d.length === 10 ? "" : "Укажите корректный номер телефона"; },
    service: function () { return selected ? "" : "Выберите специальность"; },
    username: function (v) { return LOGIN.test(v) ? "" : "Латинские буквы, цифры и символы _ @ . -, не короче 3 символов"; },
    password: function (v) { return !v ? "Придумайте пароль" : v.length >= 7 ? "" : "Пароль должен быть не короче 7 символов"; },
    password_confirmation: function (v) { return !v ? "Повторите пароль" : v === input("password").value ? "" : "Пароли не совпадают"; }
  };
  var keys = Object.keys(rules);
  function value(k) { return k === "service" ? "" : input(k).value; }
  function error(k) { return rules[k](value(k)); }
  function show(k) { setFieldError(field(k), error(k)); }
  function allValid() { return keys.every(function (k) { return !error(k); }); }
  function refresh() { var ok = allValid(); submit.disabled = !ok; submit.classList.toggle("is-disabled", !ok); }

  keys.forEach(function (k) {
    if (k === "service") return;
    var el = input(k);
    el.addEventListener("blur", function () { show(k); if (k === "password" && input("password_confirmation").value) show("password_confirmation"); refresh(); });
    el.addEventListener("input", function () {
      if (field(k).classList.contains("is-error")) show(k);
      if (k === "password" && field("password_confirmation").classList.contains("is-error")) show("password_confirmation");
      refresh();
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    keys.forEach(show);
    if (!allValid()) return;
    /* «сервер»: логин уже занят */
    if (TAKEN.indexOf(input("username").value.trim().toLowerCase()) !== -1) { setFieldError(field("username"), "Такой логин уже зарегистрирован"); return; }
    location.href = "staff-specialist.html";   /* после регистрации — календарь, где можно открыть слоты */
  });

  /* ---------- Состояния для просмотра ---------- */
  renderList("");
  if (qs("state") === "errors") {
    input("last_name").value = "Иванова";
    input("email").value = "ivanova@";
    phone.value = "900 12";
    input("username").value = "ivanova";
    input("password").value = "abcd";
    input("password_confirmation").value = "abcde";
    keys.forEach(show);
    setFieldError(field("username"), "Такой логин уже зарегистрирован");
  }
  if (qs("state") === "open") open(true);
  refresh();
})();
