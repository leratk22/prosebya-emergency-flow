/* Просебя · вход сотрудников: общие помощники страниц staff-login / staff-recovery / staff-reset */
window.SA = (function () {
  "use strict";
  var EYE = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M1.8 10S4.6 4.5 10 4.5 18.2 10 18.2 10 15.4 15.5 10 15.5 1.8 10 1.8 10z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="10" cy="10" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>';
  var EYE_OFF = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M1.8 10S4.6 4.5 10 4.5c1.2 0 2.3.3 3.3.7M18.2 10s-2.8 5.5-8.2 5.5c-1.2 0-2.3-.3-3.3-.7M8.2 8.2a2.4 2.4 0 003.6 3.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 3l14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  return {
    field: function (k) { return document.querySelector('[data-field="' + k + '"]'); },
    /* значок «показать пароль» у полей с data-eye="<id поля>" */
    eyes: function (root) {
      Array.prototype.forEach.call(root.querySelectorAll("[data-eye]"), function (b) {
        var inp = document.getElementById(b.getAttribute("data-eye"));
        b.innerHTML = EYE;
        b.addEventListener("click", function () {
          var show = inp.type === "password";
          inp.type = show ? "text" : "password";
          b.innerHTML = show ? EYE_OFF : EYE;
          b.setAttribute("aria-label", show ? "Скрыть пароль" : "Показать пароль");
        });
      });
    }
  };
})();
