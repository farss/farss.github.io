(function () {
  var blocks = document.querySelectorAll("section div.highlight, section pre");
  if (!blocks.length) return;

  var ICON_COPY =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  var ICON_CHECK =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      document.body.removeChild(ta);
    }
  }

  blocks.forEach(function (el) {
    if (el.closest(".code-block")) return;
    if (el.tagName === "PRE" && el.parentElement && el.parentElement.classList.contains("highlight")) {
      return;
    }

    var wrap = document.createElement("div");
    wrap.className = "code-block";
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.innerHTML = ICON_COPY;
    btn.setAttribute("aria-label", "复制代码");
    btn.setAttribute("title", "复制");
    wrap.appendChild(btn);

    var timer = null;
    btn.addEventListener("click", function () {
      var pre = wrap.querySelector("pre");
      if (!pre) return;
      var text = (pre.textContent || "").replace(/\n$/, "");
      copyText(text).then(function () {
        btn.innerHTML = ICON_CHECK;
        btn.classList.add("copied");
        btn.setAttribute("title", "已复制");
        btn.setAttribute("aria-label", "已复制");
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          btn.innerHTML = ICON_COPY;
          btn.classList.remove("copied");
          btn.setAttribute("title", "复制");
          btn.setAttribute("aria-label", "复制代码");
        }, 1600);
      }).catch(function () {
        btn.setAttribute("title", "复制失败");
      });
    });
  });
})();
