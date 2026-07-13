// Read initial state from localStorage if it exists, default to 'en'
let currentLang = localStorage.getItem('jokare_lang') || 'en';

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ja' : 'en';
  applyLanguage();
}

// Extracted core translation logic into a separate function for clean initialization
function applyLanguage() {
  // Save selection instantly to the client browser's memory
  localStorage.setItem('jokare_lang', currentLang);

  // 1. Translate all generic static dashboard texts with data-en attributes
  const elements = document.querySelectorAll('[data-en]');
  elements.forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) { el.innerText = text; }
  });

  // 2. Synchronize Form and Dynamic Layout Placeholders (Contact Page)
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

  // 3. Safely capture elements (with null checking guards for main workspace)
  const inSender = document.getElementById('in-sender');
  const inDesc = document.getElementById('in-desc');
  const inPartyA = document.getElementById('in-party-a');
  const inPurpose = document.getElementById('in-purpose');
  const inInvDate = document.getElementById('in-invoice-date');
  const inConDate = document.getElementById('in-contract-date');
  
  // 4. DYNAMIC VALUE LOCALIZATION (Only runs if the inputs exist on the workspace page)
  if (inSender && inDesc && inPartyA && inPurpose && inInvDate && inConDate) {
    if (currentLang === 'ja') {
      if (!inSender.value || inSender.value === "Alex Studio London Ltd" || inSender.value === "株式会社アレックス・スタジオ・ジャパン") inSender.value = "株式会社アレックス・スタジオ・ジャパン";
      if (!inDesc.value || inDesc.value === "Systems Infrastructure Architecture & Strategy Consultation" || inDesc.value === "システムインフラ基本設計およびクラウド統合戦略コンサルティング") inDesc.value = "システムインフラ基本設計およびクラウド統合戦略コンサルティング";
      if (!inPartyA.value || inPartyA.value === "Alex Studio London Ltd" || inPartyA.value === "株式会社アレックス・スタジオ・ジャパン") inPartyA.value = "株式会社アレックス・スタジオ・ジャパン";
      if (!inPurpose.value || inPurpose.value === "Evaluation of proprietary database systems and cloud layout engineering frameworks." || inPurpose.value === "独自データベースシステムおよびクラウドレイアウトエンジニアリング基盤の評価検証。") inPurpose.value = "独自データベースシステムおよびクラウドレイアウトエンジニアリング基盤の評価検証。";
      
      if (inInvDate.value === "July 10, 2026") inInvDate.value = "2026年7月10日";
      if (inConDate.value === "July 10, 2026") inConDate.value = "2026年7月10日";
    } else {
      if (!inSender.value || inSender.value === "株式会社アレックス・スタジオ・ジャパン" || inSender.value === "Alex Studio London Ltd") inSender.value = "Alex Studio London Ltd";
      if (!inDesc.value || inDesc.value === "システムインフラ基本設計およびクラウド統合戦略コンサルティング" || inDesc.value === "Systems Infrastructure Architecture & Strategy Consultation") inDesc.value = "Systems Infrastructure Architecture & Strategy Consultation";
      if (!inPartyA.value || inPartyA.value === "株式会社アレックス・スタジオ・ジャパン" || inPartyA.value === "Alex Studio London Ltd") inPartyA.value = "Alex Studio London Ltd";
      if (!inPurpose.value || inPurpose.value === "独自データベースシステムおよびクラウドレイアウトエンジニアリング基盤の評価検証。" || inPurpose.value === "Evaluation of proprietary database systems and cloud layout engineering frameworks.") inPurpose.value = "Evaluation of proprietary database systems and cloud layout engineering frameworks.";
      
      if (inInvDate.value === "2026年7月10日") inInvDate.value = "July 10, 2026";
      if (inConDate.value === "2026年7月10日") inConDate.value = "July 10, 2026";
    }
  }

  // 5. Update placeholder formatting hints safely
  const clientInput = document.getElementById('in-party-b');
  if (clientInput) {
    clientInput.placeholder = currentLang === 'ja' ? "企業名・取引先法人名を入力してください" : "Enter Corporate Client Full Entity Name";
  }

  const taxInput = document.getElementById('in-tax');
  if (taxInput) {
    taxInput.placeholder = currentLang === 'ja' ? "法人番号 / 適格請求書発行事業者登録番号 (例: T1234567890123)" : "Corporate Identification / Vat ID (e.g. GB1234567)";
  }

  // 6. Trigger updates safely
  syncInvoiceData();
  syncContractData();
}

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
}

// Initialization initialization: Check saved state instantly on DOM load
window.addEventListener('DOMContentLoaded', () => {
  // Fire the initial language engine evaluation block based on stored preferences
  applyLanguage();
  
  setTimeout(syncInvoiceData, 200);
  setTimeout(syncContractData, 200);
});
