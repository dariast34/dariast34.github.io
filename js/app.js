(function () {
  "use strict";

  var cfg = window.DARIAS_CONFIG || {};
  var apps = Array.isArray(window.DARIAS_APPS) ? window.DARIAS_APPS : [];
  var windowsApps = Array.isArray(window.DARIAS_WINDOWS_APPS) ? window.DARIAS_WINDOWS_APPS : [];
  var I = window.DARIAS_I18N;
  if (!I) return;

  var STATUS_KEYS = {
    development: "statusDevelopment",
    testing: "statusTesting",
    available: "statusAvailable",
    "coming-soon": "statusComingSoon"
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function hasUrl(value) {
    return typeof value === "string" && /^https?:\/\//i.test(value.trim());
  }

  function extLink(href, label, extraClass) {
    return (
      '<a class="btn ' +
      (extraClass || "btn-ghost") +
      '" href="' +
      escapeHtml(href) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(label) +
      "</a>"
    );
  }

  function statusLabel(status) {
    return I.t(STATUS_KEYS[status] || "statusComingSoon");
  }

  function appCopy(app) {
    var lang = I.getLang();
    return {
      tagline: lang === "tr" ? app.taglineTR || app.taglineEN : app.taglineEN || app.taglineTR,
      description: lang === "tr" ? app.descriptionTR || app.descriptionEN : app.descriptionEN || app.descriptionTR,
      category: lang === "tr" ? app.categoryTR || app.category : app.category || app.categoryTR
    };
  }

  function renderActions(app, opts) {
    opts = opts || {};
    var html = [];
    if (opts.learnMore !== false && app.productUrl) {
      html.push('<a class="btn btn-primary" href="' + escapeHtml(app.productUrl) + '">' + escapeHtml(I.t("learnMore")) + "</a>");
    }
    if (hasUrl(app.playStoreUrl)) {
      html.push(extLink(app.playStoreUrl, I.t("playStore"), "btn-primary"));
    } else if (opts.showPlaySoon) {
      html.push('<span class="btn btn-disabled" aria-disabled="true">' + escapeHtml(I.t("playSoon")) + "</span>");
    }
    if (hasUrl(app.apkUrl)) {
      html.push(extLink(app.apkUrl, I.t("downloadApk"), "btn-ghost"));
    }
    if (hasUrl(app.githubUrl)) {
      html.push(extLink(app.githubUrl, I.t("navGithub"), "btn-ghost"));
    }
    if (app.privacyUrl && opts.privacy) {
      html.push('<a class="btn btn-ghost" href="' + escapeHtml(app.privacyUrl) + '">' + escapeHtml(I.t("echoPrivacyCta")) + "</a>");
    }
    return html.join("");
  }

  function renderCard(app) {
    var copy = appCopy(app);
    var icon = app.icon
      ? '<img class="app-icon" src="' + escapeHtml(app.icon) + '" alt="" width="56" height="56">'
      : '<div class="app-icon app-icon-fallback" aria-hidden="true"></div>';
    return (
      '<article class="card app-card">' +
      '<div class="app-card-top">' +
      icon +
      '<div class="app-card-meta">' +
      "<h3>" +
      escapeHtml(app.name || "") +
      "</h3>" +
      '<p class="muted">' +
      escapeHtml(copy.category || "") +
      "</p>" +
      "</div>" +
      '<span class="status">' +
      escapeHtml(statusLabel(app.status)) +
      "</span>" +
      "</div>" +
      (copy.tagline ? '<p class="app-tagline">' + escapeHtml(copy.tagline) + "</p>" : "") +
      (copy.description ? "<p>" + escapeHtml(copy.description) + "</p>" : "") +
      '<div class="btn-row">' +
      renderActions(app, { showPlaySoon: true }) +
      "</div>" +
      "</article>"
    );
  }

  function renderHeader() {
    var root = document.getElementById("site-header");
    if (!root) return;
    var page = document.body.getAttribute("data-page") || "";
    var github = cfg.githubUrl || "https://github.com/dariast34";
    root.innerHTML =
      '<header class="site-header">' +
      '<div class="container header-inner">' +
      '<a class="brand" href="/">' +
      '<img src="/assets/brand/logo.svg" alt="" width="32" height="32">' +
      "<span>DARIAS</span>" +
      "</a>" +
      '<nav class="nav-desktop" aria-label="Primary">' +
      navLinks(page) +
      "</nav>" +
      '<div class="header-actions">' +
      '<div class="lang-switch" role="group" aria-label="' +
      escapeHtml(I.t("langLabel")) +
      '">' +
      '<button type="button" class="lang-btn" data-lang="tr" aria-pressed="false">TR</button>' +
      '<button type="button" class="lang-btn" data-lang="en" aria-pressed="false">EN</button>' +
      "</div>" +
      '<a class="btn btn-compact btn-ghost header-github" href="' +
      escapeHtml(github) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(I.t("navGithub")) +
      "</a>" +
      '<button type="button" class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="mobile-nav" data-i18n-aria="menuOpen">' +
      '<span class="menu-bars" aria-hidden="true"></span>' +
      "</button>" +
      "</div>" +
      "</div>" +
      '<div class="mobile-panel" id="mobile-nav" hidden>' +
      '<nav class="nav-mobile" aria-label="Mobile">' +
      navLinks(page) +
      '<a href="' +
      escapeHtml(github) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(I.t("navGithub")) +
      "</a>" +
      "</nav>" +
      "</div>" +
      "</header>";
  }

  function navLinks(page) {
    var items = [
      ["/", "navHome", "home"],
      ["/apps/", "navApps", "apps"],
      ["/games/", "navGames", "games"],
      ["/windows/", "navWindows", "windows"],
      ["/about/", "navAbout", "about"]
    ];
    return items
      .map(function (item) {
        var current = page === item[2] || (item[2] === "apps" && page === "echo");
        return (
          '<a href="' +
          item[0] +
          '"' +
          (current ? ' aria-current="page"' : "") +
          ">" +
          escapeHtml(I.t(item[1])) +
          "</a>"
        );
      })
      .join("");
  }

  function renderFooter() {
    var root = document.getElementById("site-footer");
    if (!root) return;
    var year = String(new Date().getFullYear());
    var github = cfg.githubUrl || "https://github.com/dariast34";
    root.innerHTML =
      '<footer class="site-footer">' +
      '<div class="container footer-inner">' +
      '<div class="footer-brand">' +
      '<a class="brand" href="/">' +
      '<img src="/assets/brand/logo.svg" alt="" width="28" height="28">' +
      "<span>DARIAS</span>" +
      "</a>" +
      '<p class="muted">' +
      escapeHtml(I.t("footerNote")) +
      "</p>" +
      "</div>" +
      '<nav class="footer-nav" aria-label="Footer">' +
      '<a href="/apps/">' +
      escapeHtml(I.t("navApps")) +
      "</a>" +
      '<a href="/games/">' +
      escapeHtml(I.t("navGames")) +
      "</a>" +
      '<a href="/windows/">' +
      escapeHtml(I.t("navWindows")) +
      "</a>" +
      '<a href="/privacy/">' +
      escapeHtml(I.t("navPrivacy")) +
      "</a>" +
      '<a href="' +
      escapeHtml(github) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(I.t("navGithub")) +
      "</a>" +
      "</nav>" +
      "</div>" +
      '<div class="container footer-copy"><p>© <span id="year">' +
      year +
      "</span> Darias.</p></div>" +
      "</footer>";
  }

  function syncLangButtons() {
    var lang = I.getLang();
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }

  function closeMenu() {
    var panel = document.getElementById("mobile-nav");
    var toggle = document.getElementById("menu-toggle");
    if (!panel || !toggle) return;
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", I.t("menuOpen"));
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    var panel = document.getElementById("mobile-nav");
    var toggle = document.getElementById("menu-toggle");
    if (!panel || !toggle) return;
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", I.t("menuClose"));
    document.body.classList.add("menu-open");
  }

  function bindChrome() {
    document.addEventListener("click", function (event) {
      var langBtn = event.target.closest(".lang-btn");
      if (langBtn) {
        I.setLang(langBtn.getAttribute("data-lang"));
        refresh();
        return;
      }
      if (event.target.closest("#menu-toggle")) {
        var open = document.body.classList.contains("menu-open");
        if (open) closeMenu();
        else openMenu();
        return;
      }
      if (event.target.closest(".nav-mobile a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  function renderList(targetId, list, emptyKey) {
    var root = document.getElementById(targetId);
    if (!root) return;
    if (!list.length) {
      root.innerHTML = '<p class="empty">' + escapeHtml(I.t(emptyKey)) + "</p>";
      return;
    }
    root.innerHTML = list.map(renderCard).join("");
  }

  function uniqueTypes(list) {
    var seen = {};
    list.forEach(function (app) {
      if (app && app.type) seen[app.type] = true;
    });
    return Object.keys(seen);
  }

  function bindFilters(list) {
    var bar = document.getElementById("filter-bar");
    var grid = document.getElementById("apps-grid");
    if (!bar || !grid) return;
    var types = uniqueTypes(list);
    if (list.length < 2 || types.length < 2) {
      bar.hidden = true;
      renderList("apps-grid", list, "emptyApps");
      return;
    }
    bar.hidden = false;
    bar.innerHTML =
      '<button type="button" class="chip is-active" data-filter="all">' +
      escapeHtml(I.t("filterAll")) +
      "</button>" +
      '<button type="button" class="chip" data-filter="app">' +
      escapeHtml(I.t("filterApps")) +
      "</button>" +
      '<button type="button" class="chip" data-filter="game">' +
      escapeHtml(I.t("filterGames")) +
      "</button>" +
      '<button type="button" class="chip" data-filter="utility">' +
      escapeHtml(I.t("filterUtilities")) +
      "</button>";
    renderList("apps-grid", list, "emptyApps");
    bar.onclick = function (event) {
      var chip = event.target.closest("[data-filter]");
      if (!chip) return;
      bar.querySelectorAll(".chip").forEach(function (el) {
        el.classList.toggle("is-active", el === chip);
      });
      var filter = chip.getAttribute("data-filter");
      var next = filter === "all" ? list : list.filter(function (app) {
        return app.type === filter;
      });
      renderList("apps-grid", next, "emptyApps");
    };
  }

  function renderEchoPage() {
    var app = apps.filter(function (item) {
      return item.id === "echo";
    })[0];
    if (!app) return;
    var copy = appCopy(app);
    var title = document.getElementById("echo-name");
    var tag = document.getElementById("echo-tagline");
    var lead = document.getElementById("echo-lead");
    var status = document.getElementById("echo-status");
    var actions = document.getElementById("echo-actions");
    var shots = document.getElementById("echo-screenshots");
    if (title) title.textContent = app.name || "ECHO";
    if (tag) tag.textContent = copy.tagline || I.t("echoTagline");
    if (lead) lead.textContent = copy.description || I.t("echoLead");
    if (status) status.textContent = statusLabel(app.status);
    if (actions) {
      actions.innerHTML = renderActions(app, {
        learnMore: false,
        showPlaySoon: true,
        privacy: true
      });
    }
    if (shots) {
      var images = Array.isArray(app.screenshots) ? app.screenshots.filter(Boolean) : [];
      if (!images.length) {
        shots.innerHTML = '<p class="empty">' + escapeHtml(I.t("screenshotsSoon")) + "</p>";
      } else {
        shots.innerHTML = images
          .map(function (src) {
            return '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(app.name || "ECHO") + '" loading="lazy">';
          })
          .join("");
      }
    }
  }

  function renderContact() {
    document.querySelectorAll("[data-contact]").forEach(function (el) {
      if (cfg.contactEmail) {
        el.innerHTML =
          '<a href="mailto:' + escapeHtml(cfg.contactEmail) + '">' + escapeHtml(cfg.contactEmail) + "</a>";
      } else {
        el.textContent = I.t("contactSoon");
      }
    });
  }

  function renderPage() {
    var page = document.body.getAttribute("data-page") || "";
    var androidApps = apps.filter(function (app) {
      return !app.platforms || app.platforms.indexOf("android") !== -1;
    });
    if (page === "home") {
      renderList(
        "featured-grid",
        androidApps.filter(function (app) {
          return app.featured;
        }),
        "emptyApps"
      );
    }
    if (page === "apps") bindFilters(androidApps);
    if (page === "games") {
      renderList(
        "games-grid",
        apps.filter(function (app) {
          return app.type === "game";
        }),
        "emptyGames"
      );
    }
    if (page === "windows") renderList("windows-grid", windowsApps, "windowsEmpty");
    if (page === "echo") renderEchoPage();
    renderContact();
  }

  function refresh() {
    I.apply();
    renderHeader();
    renderFooter();
    I.apply();
    syncLangButtons();
    renderPage();
    var toggle = document.getElementById("menu-toggle");
    if (toggle) toggle.setAttribute("aria-label", I.t("menuOpen"));
  }

  I.setLang(I.getLang());
  refresh();
  bindChrome();
})();
