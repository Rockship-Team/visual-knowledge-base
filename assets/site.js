(function () {
  var grid = document.getElementById("catalog-grid");
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
  var searchInput = document.getElementById("catalog-search");
  var pillsContainer = document.getElementById("catalog-pills");
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
      Array.prototype.forEach.call(pillsContainer.children, function (el) {
        el.setAttribute("aria-pressed", el === btn ? "true" : "false");
      });
      applyFilter();
    });
    return btn;
  }

  if (pillsContainer) {
    pillsContainer.appendChild(makePill("all", "Tất cả"));
    types.forEach(function (t) {
      pillsContainer.appendChild(makePill(t, t));
    });
  }

  function applyFilter() {
    var query = (searchInput && searchInput.value || "").trim().toLowerCase();
    var visibleCount = 0;
    cards.forEach(function (card) {
      var type = card.getAttribute("data-type") || "";
      var haystack = (card.getAttribute("data-search") || "").toLowerCase();
      var matchesType = activeType === "all" || type === activeType;
      var matchesQuery = query === "" || haystack.indexOf(query) !== -1;
      var visible = matchesType && matchesQuery;
      card.hidden = !visible;
      if (visible) visibleCount++;
    });
    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  if (searchInput) searchInput.addEventListener("input", applyFilter);
  applyFilter();
})();
