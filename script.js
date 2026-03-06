let isJapanese = false;

/* LOAD HEADER */
document.addEventListener("DOMContentLoaded", () => {
  fetch("/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;
      
      // Highlight the active navigation link after header loads
      const currentPath = window.location.pathname;
      document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        // Matches exact path OR sub-paths (like /store/index.html matching /store/)
        if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
          link.classList.add('active-link');
        }
      });

      initLanguage();
    });

  initContactForm();
});

/* LANGUAGE */
function initLanguage() {
  const saved = localStorage.getItem("lang");
  if (saved) {
    isJapanese = saved === "ja";
  } else {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz.includes("Tokyo")) isJapanese = true;
  }
  applyLanguage();
}

function toggleLanguage() {
  isJapanese = !isJapanese;
  localStorage.setItem("lang", isJapanese ? "ja" : "en");
  applyLanguage();
}

function applyLanguage() {
  document.querySelectorAll("[data-en]").forEach(el => {
    el.textContent = isJapanese
      ? el.dataset.ja || el.dataset.en
      : el.dataset.en;
  });
  document.documentElement.lang = isJapanese ? "ja" : "en";
}

/* CONTACT FORM */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const sourceInput = document.getElementById("source");
  const params = new URLSearchParams(window.location.search);
  sourceInput.value = params.get("source") || "general";

  form.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(form);

    fetch("https://formspree.io/f/meoydyrq", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    })
    .then(res => {
      const feedback = document.getElementById("formFeedback");
      if (res.ok) {
        feedback.textContent = isJapanese ? "✅ 送信完了しました！" : "✅ Message sent!";
        form.reset();
      } else {
        feedback.textContent = isJapanese ? "❌ 送信に失敗しました。" : "❌ Failed to send message.";
      }
    })
    .catch(() => {
      const feedback = document.getElementById("formFeedback");
      feedback.textContent = isJapanese ? "❌ 送信に失敗しました。" : "❌ Failed to send message.";
    });
  });
}
