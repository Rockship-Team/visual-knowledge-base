(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll(".category-section"));
  if (!sections.length) return;

  var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
  var searchInput = document.getElementById("catalog-search");
  var typePills = document.getElementById("catalog-pills");
  var categoryNav = document.getElementById("category-nav");
  var emptyState = document.getElementById("catalog-empty");
  var activeType = "all";

  var types = [];
  cards.forEach(function (card) {
    var t = card.getAttribute("data-type");
    if (t && types.indexOf(t) === -1) types.push(t);
  });

  function makePill(value, label) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pill";
    btn.textContent = label;
    btn.setAttribute("aria-pressed", value === "all" ? "true" : "false");
    btn.addEventListener("click", function () {
      activeType = value;
      Array.prototype.forEach.call(typePills.children, function (el) {
        el.setAttribute("aria-pressed", el === btn ? "true" : "false");
      });
      applyFilter();
    });
    return btn;
  }

  if (typePills) {
    var allPill = makePill("all", "All");
    allPill.setAttribute("data-label-en", "All");
    allPill.setAttribute("data-label-vi", "Tất cả");
    typePills.appendChild(allPill);
    types.forEach(function (t) {
      typePills.appendChild(makePill(t, t));
    });
  }

  if (categoryNav) {
    sections.forEach(function (section) {
      var label = section.getAttribute("data-category-label") || section.id;
      var a = document.createElement("a");
      a.href = "#" + section.id;
      a.textContent = label;
      categoryNav.appendChild(a);
    });
  }

  function applyFilter() {
    var query = (searchInput && searchInput.value || "").trim().toLowerCase();
    var totalVisible = 0;

    sections.forEach(function (section) {
      var sectionCards = Array.prototype.slice.call(section.querySelectorAll(".card"));
      var visibleInSection = 0;
      sectionCards.forEach(function (card) {
        var type = card.getAttribute("data-type") || "";
        var haystack = (card.getAttribute("data-search") || "").toLowerCase();
        var matchesType = activeType === "all" || type === activeType;
        var matchesQuery = query === "" || haystack.indexOf(query) !== -1;
        var visible = matchesType && matchesQuery;
        card.hidden = !visible;
        if (visible) visibleInSection++;
      });
      section.hidden = visibleInSection === 0;
      totalVisible += visibleInSection;
    });

    if (emptyState) emptyState.hidden = totalVisible !== 0;
  }

  if (searchInput) searchInput.addEventListener("input", applyFilter);
  applyFilter();
})();
