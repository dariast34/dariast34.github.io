(function (global) {
  "use strict";

  var STORAGE_KEY = "darias-lang";

  var STRINGS = {
    en: {
      skip: "Skip to content",
      navHome: "Home",
      navApps: "Apps",
      navGames: "Games",
      navWindows: "Windows",
      navAbout: "About",
      navPrivacy: "Privacy",
      navGithub: "GitHub",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      langLabel: "Language",
      heroEyebrow: "Software studio",
      heroTitle: "DARIAS",
      heroLine1: "Simple ideas.",
      heroLine2: "Better experiences.",
      heroLead: "Useful apps, creative games and simple software built with care.",
      ctaApps: "Explore Apps",
      ctaGithub: "GitHub",
      featured: "Featured",
      featuredLead: "Current work from Darias.",
      aboutTitle: "About Darias",
      aboutBody:
        "Darias creates useful apps, creative games and lightweight software with a focus on simplicity, privacy and good user experience.",
      createdBy: "Created by Derya Toklu",
      contactSoon: "Contact details coming soon.",
      appsTitle: "Apps",
      appsLead: "Android apps and games from Darias.",
      gamesTitle: "Games",
      gamesLead: "Games designed around a simple, clear idea.",
      windowsTitle: "Windows",
      windowsLead: "Desktop software from Darias.",
      windowsEmpty: "Darias Windows software is coming soon.",
      aboutPageTitle: "About",
      filterAll: "All",
      filterApps: "Apps",
      filterGames: "Games",
      filterUtilities: "Utilities",
      statusDevelopment: "Development",
      statusTesting: "Testing",
      statusAvailable: "Available",
      statusComingSoon: "Coming Soon",
      learnMore: "Learn More",
      playStore: "Get it on Google Play",
      playSoon: "Coming Soon",
      downloadApk: "Download APK",
      screenshotsTitle: "Screenshots",
      screenshotsSoon: "Screenshots coming soon.",
      emptyApps: "No apps to show yet.",
      emptyGames: "No games to show yet.",
      privacyPolicyTitle: "Privacy Policy",
      lastUpdatedEcho: "Last updated: 16 August 2026",
      privacyTitle: "Privacy",
      privacyLead: "Public privacy policies for Darias products.",
      privacySiteTitle: "This website",
      echoTitle: "ECHO",
      echoTagline: "Beat Your Digital Self",
      echoLead:
        "ECHO learns from your choices and tries to predict what you'll choose next. Your goal is simple: surprise your digital self.",
      echoFeatures: "Features",
      echoLearnTitle: "Learn",
      echoLearnBody: "ECHO learns from the choices you make.",
      echoPredictTitle: "Predict",
      echoPredictBody: "It tries to predict your next decision.",
      echoChallengeTitle: "Challenge",
      echoChallengeBody: "Beat your own digital pattern.",
      echoOfflineTitle: "Offline",
      echoOfflineBody: "Core gameplay works without an internet connection.",
      echoPrivateTitle: "Private",
      echoPrivateBody: "Your choices stay on your device.",
      echoStatusTitle: "Status",
      echoPrivacyCta: "Privacy Policy",
      echoDownload: "Download",
      notFoundTitle: "Lost in the Echo?",
      notFoundBody: "This page is not here. The path ended before the next choice.",
      backHome: "Back to Home",
      footerNote: "Created by Derya Toklu",
      noscript:
        "JavaScript is off. You can still browse Darias pages and read privacy policies."
    },
    tr: {
      skip: "İçeriğe geç",
      navHome: "Ana Sayfa",
      navApps: "Uygulamalar",
      navGames: "Oyunlar",
      navWindows: "Windows",
      navAbout: "Hakkında",
      navPrivacy: "Gizlilik",
      navGithub: "GitHub",
      menuOpen: "Menüyü aç",
      menuClose: "Menüyü kapat",
      langLabel: "Dil",
      heroEyebrow: "Yazılım stüdyosu",
      heroTitle: "DARIAS",
      heroLine1: "Basit fikirler.",
      heroLine2: "Daha iyi deneyimler.",
      heroLead: "Özenle geliştirilen faydalı uygulamalar, yaratıcı oyunlar ve sade yazılımlar.",
      ctaApps: "Uygulamaları Keşfet",
      ctaGithub: "GitHub",
      featured: "Öne Çıkan",
      featuredLead: "Darias’ın güncel çalışmaları.",
      aboutTitle: "Darias Hakkında",
      aboutBody:
        "Darias; sadelik, gizlilik ve iyi kullanıcı deneyimine odaklanan faydalı uygulamalar, yaratıcı oyunlar ve hafif yazılımlar geliştirir.",
      createdBy: "Derya Toklu tarafından geliştirildi",
      contactSoon: "İletişim bilgileri yakında.",
      appsTitle: "Uygulamalar",
      appsLead: "Darias’ın Android uygulama ve oyunları.",
      gamesTitle: "Oyunlar",
      gamesLead: "Net ve sade bir fikir etrafında tasarlanan oyunlar.",
      windowsTitle: "Windows",
      windowsLead: "Darias masaüstü yazılımları.",
      windowsEmpty: "Darias Windows yazılımları yakında burada.",
      aboutPageTitle: "Hakkında",
      filterAll: "Tümü",
      filterApps: "Uygulamalar",
      filterGames: "Oyunlar",
      filterUtilities: "Araçlar",
      statusDevelopment: "Geliştiriliyor",
      statusTesting: "Test Aşamasında",
      statusAvailable: "Yayında",
      statusComingSoon: "Yakında",
      learnMore: "Daha Fazla",
      playStore: "Google Play’den alın",
      playSoon: "Yakında",
      downloadApk: "APK İndir",
      screenshotsTitle: "Ekran görüntüleri",
      screenshotsSoon: "Ekran görüntüleri yakında.",
      emptyApps: "Henüz gösterilecek uygulama yok.",
      emptyGames: "Henüz gösterilecek oyun yok.",
      privacyPolicyTitle: "Gizlilik Politikası",
      lastUpdatedEcho: "Son güncelleme: 16 Ağustos 2026",
      privacyTitle: "Gizlilik",
      privacyLead: "Darias ürünleri için herkese açık gizlilik politikaları.",
      privacySiteTitle: "Bu web sitesi",
      echoTitle: "ECHO",
      echoTagline: "Dijital Benliğini Yen",
      echoLead:
        "ECHO seçimlerinden öğrenir ve bir sonraki tercihini tahmin etmeye çalışır. Amacın basit: dijital benliğini şaşırt.",
      echoFeatures: "Özellikler",
      echoLearnTitle: "Öğrenir",
      echoLearnBody: "ECHO yaptığın seçimlerden öğrenir.",
      echoPredictTitle: "Tahmin eder",
      echoPredictBody: "Bir sonraki kararını tahmin etmeye çalışır.",
      echoChallengeTitle: "Meydan okur",
      echoChallengeBody: "Kendi dijital örüntünü yen.",
      echoOfflineTitle: "Çevrimdışı",
      echoOfflineBody: "Temel oynanış internet bağlantısı olmadan çalışır.",
      echoPrivateTitle: "Gizli",
      echoPrivateBody: "Seçimlerin cihazında kalır.",
      echoStatusTitle: "Durum",
      echoPrivacyCta: "Gizlilik Politikası",
      echoDownload: "İndir",
      notFoundTitle: "Echo’da mı kayboldun?",
      notFoundBody: "Bu sayfa burada değil. Yol, bir sonraki seçimden önce bitti.",
      backHome: "Ana Sayfaya Dön",
      footerNote: "Derya Toklu tarafından geliştirildi",
      noscript:
        "JavaScript kapalı. Darias sayfalarını ve gizlilik politikalarını yine de görüntüleyebilirsin."
    }
  };

  function detectLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "tr" || stored === "en") return stored;
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    return nav.indexOf("tr") === 0 ? "tr" : "en";
  }

  var current = detectLang();

  function t(key) {
    var pack = STRINGS[current] || STRINGS.en;
    return pack[key] || STRINGS.en[key] || key;
  }

  function setLang(lang) {
    current = lang === "tr" ? "tr" : "en";
    try {
      localStorage.setItem(STORAGE_KEY, current);
    } catch (e) {}
    document.documentElement.lang = current === "tr" ? "tr" : "en";
    document.documentElement.dataset.lang = current;
    return current;
  }

  function apply() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (key) el.setAttribute("aria-label", t(key));
    });
    document.querySelectorAll("[data-lang-block]").forEach(function (el) {
      el.hidden = el.getAttribute("data-lang-block") !== current;
    });
  }

  global.DARIAS_I18N = {
    t: t,
    setLang: setLang,
    apply: apply,
    getLang: function () {
      return current;
    },
    detectLang: detectLang
  };
})(window);
