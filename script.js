let isJapanese = false;

/* LOAD HEADER */
document.addEventListener("DOMContentLoaded", () => {
  fetch("/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;
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
      document.getElementById("formFeedback").textContent =
        res.ok ? "✅ Message sent!" : "❌ Failed to send message.";
      if (res.ok) form.reset();
    })
    .catch(() => {
      document.getElementById("formFeedback").textContent =
        "❌ Failed to send message.";
    });
  });
}
