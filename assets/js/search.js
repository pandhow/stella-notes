/* 纯前端搜索：读 window.SEARCH_INDEX，防抖过滤标题/摘要/标签 */
(function () {
  var input = document.getElementById("search-input");
  var box = document.getElementById("search-results");
  var index = window.SEARCH_INDEX || [];
  if (!input || !box) return;

  function render(kw) {
    kw = kw.trim().toLowerCase();
    if (!kw) { box.hidden = true; box.innerHTML = ""; return; }
    var hits = index.filter(function (p) {
      return p.title.toLowerCase().indexOf(kw) > -1 ||
        p.summary.toLowerCase().indexOf(kw) > -1 ||
        p.tags.join(" ").toLowerCase().indexOf(kw) > -1;
    });
    box.hidden = false;
    if (!hits.length) {
      box.innerHTML = '<p class="search-empty">这片星域暂无匹配的文章…</p>';
      return;
    }
    box.innerHTML = hits.map(function (p) {
      return '<a class="search-hit" href="' + p.url + '">' +
        "<strong>" + p.title + "</strong>" +
        "<small>" + p.date + " · " + p.tags.join(" / ") + "</small></a>";
    }).join("");
  }

  var timer;
  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(function () { render(input.value); }, 160);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== input) {
      e.preventDefault(); input.focus();
    }
    if (e.key === "Escape") { input.value = ""; render(""); input.blur(); }
  });
})();
