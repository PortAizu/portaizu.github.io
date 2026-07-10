let currentLang = 'en';

function toggleLanguage() {
  // Flip the active state
  currentLang = currentLang === 'en' ? 'ja' : 'en';
  
  // 1. Update all standard text nodes with translation metrics
  const elements = document.querySelectorAll('[data-en]');
  elements.forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) {
      el.innerText = text;
    }
  });

  // 2. Dynamically update form placeholders if they exist (on contact page)
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const msgInput = document.querySelector('textarea[name="message"]');

  if (nameInput && emailInput && msgInput) {
    if (currentLang === 'ja') {
      nameInput.placeholder = "例：山田 太郎";
      emailInput.placeholder = "example@company.com";
      msgInput.placeholder = "どのようなツールやシステムのカスタマイズをご希望ですか？詳細をご記入ください。";
    } else {
      nameInput.placeholder = "";
      emailInput.placeholder = "";
      msgInput.placeholder = "";
    }
  }
}

// Ensure the page drops into the current active language layout on load
document.addEventListener('DOMContentLoaded', () => {
  // Optional: Add logic here if you want to detect browser language automatically
});
