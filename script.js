let currentLang = 'en';

function toggleLanguage() {
  // Flip the active language state
  currentLang = currentLang === 'en' ? 'ja' : 'en';
  
  // 1. Scan and dynamically translate all elements with data-en/data-ja attributes
  const elements = document.querySelectorAll('[data-en]');
  elements.forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) {
      el.innerText = text;
    }
  });

  // 2. Synchronize Form and Dynamic Layout Placeholders (Contact Page)
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const msgInput = document.querySelector('textarea[name="message"]');

  if (nameInput && emailInput && msgInput) {
    if (currentLang === 'ja') {
      nameInput.placeholder = "例：山田 太郎";
      emailInput.placeholder = "example@company.com";
      msgInput.placeholder = "どのようなツールやシステムのカスタマイズをご希望ですか？詳細をご記入ください。";
    } else {
      nameInput.placeholder = "Enter your full name or company";
      emailInput.placeholder = "example@company.com";
      msgInput.placeholder = "Describe your specific tool customization requirements here...";
    }
  }

  // 3. Dynamic Placeholder Updates for Workspace Panels (NDA & Invoice Input fields)
  const clientInput = document.getElementById('in-party-b');
  if (clientInput) {
    if (currentLang === 'ja') {
      clientInput.placeholder = "企業名・取引先法人名を入力してください";
    } else {
      clientInput.placeholder = "Enter Corporate Client Full Entity Name";
    }
  }

  const taxInput = document.getElementById('in-tax');
  if (taxInput) {
    if (currentLang === 'ja') {
      taxInput.placeholder = "法人番号 / 適格請求書発行事業者登録番号 (例: T1234567890123)";
    } else {
      taxInput.placeholder = "Corporate Identification / Vat ID (e.g. GB1234567)";
    }
  }
}

// Ensure proper localization settings apply immediately upon browser load
document.addEventListener('DOMContentLoaded', () => {
  // Add initialization logic here if you want to remember language state across page sessions
});
