// Read initial state from localStorage if it exists, default to 'en'
let currentLang = localStorage.getItem('jokare_lang') || 'en';

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ja' : 'en';
  applyLanguage();
}

function applyLanguage() {
  localStorage.setItem('jokare_lang', currentLang);

  // 1. Translate all generic static dashboard texts
  const elements = document.querySelectorAll('[data-en]');
  elements.forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) { el.innerText = text; }
  });

  // 2. Synchronize Form and Placeholders (Contact Page)
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="_replyto"]');
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

  // 3. Update placeholder formatting hints safely
  const clientInput = document.getElementById('in-party-b');
  if (clientInput) {
    clientInput.placeholder = currentLang === 'ja' ? "企業名・取引先法人名を入力してください" : "Enter Corporate Client Full Entity Name";
  }

  const taxInput = document.getElementById('in-tax');
  if (taxInput) {
    taxInput.placeholder = currentLang === 'ja' ? "法人番号 / 適格請求書発行事業者登録番号 (例: T1234567890123)" : "Corporate Identification / Vat ID (e.g. GB1234567)";
  }

  // 4. Update the actual invoice/contract data to match the language update
  syncInvoiceData();
  syncContractData();
}

// -------------------------------------------------------------------------
// ⚡ LOCAL STORAGE DRAFT ENGINE (SAVES DATA TO USER'S MACHINE)
// -------------------------------------------------------------------------
function saveDraftsToLocal() {
  const fields = [
    'in-sender', 'in-tax', 'in-desc', 'in-curr', 'in-price', 'in-invoice-date',
    'in-party-a', 'in-party-b', 'in-purpose', 'in-contract-date'
  ];

  fields.forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) {
      localStorage.setItem(`jokare_draft_${fieldId}`, el.value);
    }
  });
}

function loadDraftsFromLocal() {
  const fields = [
    'in-sender', 'in-tax', 'in-desc', 'in-curr', 'in-price', 'in-invoice-date',
    'in-party-a', 'in-party-b', 'in-purpose', 'in-contract-date'
  ];

  fields.forEach(fieldId => {
    const el = document.getElementById(fieldId);
    const savedValue = localStorage.getItem(`jokare_draft_${fieldId}`);
    if (el && savedValue !== null) {
      el.value = savedValue;
    }
  });
}

// -------------------------------------------------------------------------
// SYNCHRONIZATION RUNNERS (CALLED ON KEYPRESS/INPUT)
// -------------------------------------------------------------------------
function syncInvoiceData() {
  const inSender = document.getElementById('in-sender');
  const inTax = document.getElementById('in-tax');
  const inDesc = document.getElementById('in-desc');
  const inCurr = document.getElementById('in-curr');
  const inPrice = document.getElementById('in-price');
  const inInvDate = document.getElementById('in-invoice-date');

  if (!inSender || !inDesc || !inCurr || !inPrice || !inInvDate) return;

  const sender = inSender.value || '---';
  const tax = inTax ? inTax.value : '';
  const desc = inDesc.value || '---';
  const curr = inCurr.value;
  const price = parseFloat(inPrice.value) || 0;
  const dateVal = inInvDate.value || '---';

  const outSender = document.getElementById('out-sender');
  const outTax = document.getElementById('out-tax');
  const outDesc = document.getElementById('out-desc');
  const invoiceDateOut = document.getElementById('invoice-date-out');
  const outPrice = document.getElementById('out-price');
  const outTotal = document.getElementById('out-total');

  if (outSender) outSender.innerText = sender;
  if (outTax) outTax.innerText = tax ? "Tax ID: " + tax : (currentLang === 'ja' ? "登録番号: 未設定" : "Tax ID: Not Set");
  if (outDesc) outDesc.innerText = desc;
  if (invoiceDateOut) invoiceDateOut.innerText = dateVal;
  
  const combinedVal = curr + price.toLocaleString();
  if (outPrice) outPrice.innerText = combinedVal;
  if (outTotal) outTotal.innerText = combinedVal;

  // Auto-save values to computer hard drive as user types
  saveDraftsToLocal();
}

function syncContractData() {
  const inPartyA = document.getElementById('in-party-a');
  const inPartyB = document.getElementById('in-party-b');
  const inPurpose = document.getElementById('in-purpose');
  const inConDate = document.getElementById('in-contract-date');

  if (!inPartyA || !inPartyB || !inPurpose || !inConDate) return;

  const partyA = inPartyA.value || '---';
  const partyB = inPartyB.value || (currentLang === 'ja' ? '[受領当事者名称]' : '[Receiving Party Entity]');
  const purpose = inPurpose.value || '---';
  const dateVal = inConDate.value || '---';

  const outPartyA = document.getElementById('out-party-a');
  const outPartyB = document.getElementById('out-party-b');
  const outPurpose = document.getElementById('out-purpose');
  const contractDateOut = document.getElementById('contract-date-out');

  if (outPartyA) outPartyA.innerText = partyA;
  if (outPartyB) outPartyB.innerText = partyB;
  if (outPurpose) outPurpose.innerText = purpose;
  if (contractDateOut) contractDateOut.innerText = dateVal;

  // Auto-save values to computer hard drive as user types
  saveDraftsToLocal();
}

// -------------------------------------------------------------------------
// DOM REVEAL INITIALIZATION PIPELINE
// -------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  // 1. Load any previously saved drafts from client's hard drive first
  loadDraftsFromLocal();
  
  // 2. Set the global translated views based on language settings
  applyLanguage();
  
  // 3. Run structural alignments
  setTimeout(syncInvoiceData, 200);
  setTimeout(syncContractData, 200);
});
