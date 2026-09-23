(function () {
  var STORAGE_KEY = "vkb-lang";
  var SUPPORTED = ["en", "vi"];
  var DEFAULT_LANG = "en";

  function getLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function apply(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.hidden = el.getAttribute("data-lang") !== lang;
    });

    document.querySelectorAll("[data-label-en]").forEach(function (el) {
      var text = lang === "vi" ? el.getAttribute("data-label-vi") : el.getAttribute("data-label-en");
      if (text) el.textContent = text;
    });

    document.querySelectorAll("[data-ph-en]").forEach(function (el) {
      var ph = lang === "vi" ? el.getAttribute("data-ph-vi") : el.getAttribute("data-ph-en");
      if (ph) el.placeholder = ph;
    });

    document.querySelectorAll(".lang-switch [data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-set-lang") === lang ? "true" : "false");
    });
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    apply(lang);
  }

  apply(getLang());

  document.querySelectorAll(".lang-switch [data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-set-lang"));
    });
  });

  var topicBadge = document.querySelector(".topic-meta .badge");
  if (topicBadge) {
    document.body.setAttribute("data-topic-type", topicBadge.textContent.trim());
  }
})();
