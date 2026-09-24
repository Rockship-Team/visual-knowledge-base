(function () {
  var catalog = window.VKB_CATALOG;
  var main = document.querySelector("main.wrap");
  var footer = document.querySelector("footer.site-footer .wrap");
  if (!catalog || !main || !footer) return;

  var slug = (location.pathname.match(/\/diagrams\/([^/]+)\/?/) || [])[1];
  var index = -1;
  for (var i = 0; i < catalog.length; i++) {
    if (catalog[i].slug === slug) { index = i; break; }
  }
  if (index === -1) return;

  var current = catalog[index];
  var prev = index > 0 ? catalog[index - 1] : null;
  var next = index < catalog.length - 1 ? catalog[index + 1] : null;

  function topicLink(topic) {
    var a = document.createElement("a");
    a.href = "../" + topic.slug + "/";
    a.innerHTML =
      '<span class="pager-cat">' + topic.category + '</span>' +
      '<span class="pager-title">' + topic.title + '</span>';
    return a;
  }

  // --- prev/next pager ---
  if (prev || next) {
    var pager = document.createElement("nav");
    pager.className = "topic-pager";
    pager.setAttribute("aria-label", "Adjacent topics");

    if (prev) {
      var prevSlot = document.createElement("div");
      prevSlot.className = "pager-slot pager-prev";
      var prevLink = topicLink(prev);
      prevLink.classList.add("pager-link");
      var prevLabel = document.createElement("span");
      prevLabel.className = "pager-dir";
      prevLabel.innerHTML = '<span data-lang="en">← Previous</span><span data-lang="vi" hidden>← Trước</span>';
      prevLink.insertBefore(prevLabel, prevLink.firstChild);
      prevSlot.appendChild(prevLink);
      pager.appendChild(prevSlot);
    }

    if (next) {
      var nextSlot = document.createElement("div");
      nextSlot.className = "pager-slot pager-next";
      var nextLink = topicLink(next);
      nextLink.classList.add("pager-link");
      var nextLabel = document.createElement("span");
      nextLabel.className = "pager-dir";
      nextLabel.innerHTML = '<span data-lang="en">Next →</span><span data-lang="vi" hidden>Tiếp →</span>';
      nextLink.insertBefore(nextLabel, nextLink.firstChild);
      nextSlot.appendChild(nextLink);
      pager.appendChild(nextSlot);
    }

    main.appendChild(pager);
  }

  // --- related topics: same category, ranked by shared tags ---
  var related = catalog
    .filter(function (t) { return t.slug !== current.slug; })
    .map(function (t) {
      var shared = t.tags.filter(function (tag) { return current.tags.indexOf(tag) !== -1; }).length;
      var sameCategory = t.categoryId === current.categoryId ? 1 : 0;
      return { topic: t, score: sameCategory * 10 + shared };
    })
    .filter(function (r) { return r.score > 0; })
    .sort(function (a, b) { return b.score - a.score; })
    .slice(0, 3)
    .map(function (r) { return r.topic; });

  if (related.length) {
    var section = document.createElement("section");
    section.className = "related-topics";
    var h2 = document.createElement("h2");
    h2.innerHTML = '<span data-lang="en">Related Topics</span><span data-lang="vi" hidden>Chủ đề liên quan</span>';
    section.appendChild(h2);
    var list = document.createElement("div");
    list.className = "related-grid";
    related.forEach(function (t) {
      var a = document.createElement("a");
      a.className = "related-card";
      a.href = "../" + t.slug + "/";
      a.innerHTML =
        '<span class="badge">' + t.type + '</span>' +
        '<span class="related-title">' + t.title + '</span>';
      list.appendChild(a);
    });
    section.appendChild(list);
    main.appendChild(section);
  }

  // --- copy-to-clipboard on code blocks ---
  document.querySelectorAll(".prose pre").forEach(function (pre) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.innerHTML = '<span data-lang="en">Copy</span><span data-lang="vi" hidden>Sao chép</span>';
    btn.addEventListener("click", function () {
      var code = pre.querySelector("code");
      var text = code ? code.textContent : pre.textContent;
      var done = function () {
        var original = btn.innerHTML;
        btn.innerHTML = '<span data-lang="en">Copied</span><span data-lang="vi" hidden>Đã chép</span>';
        btn.querySelectorAll("[data-lang]").forEach(function (el) {
          el.hidden = el.getAttribute("data-lang") !== document.documentElement.lang;
        });
        setTimeout(function () {
          btn.innerHTML = original;
          btn.querySelectorAll("[data-lang]").forEach(function (el) {
            el.hidden = el.getAttribute("data-lang") !== document.documentElement.lang;
          });
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        done();
      }
    });
    pre.style.position = "relative";
    pre.appendChild(btn);
  });
})();
