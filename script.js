let currentLang = 'en';

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ja' : 'en';
  
  // 1. Translate all generic static dashboard texts
  const elements = document.querySelectorAll('[data-en]');
  elements.forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) { el.innerText = text; }
  });

  const inSender = document.getElementById('in-sender');
  const inDesc = document.getElementById('in-desc');
  const inPartyA = document.getElementById('in-party-a');
  const inPurpose = document.getElementById('in-purpose');
  const inInvDate = document.getElementById('in-invoice-date');
  const inConDate = document.getElementById('in-contract-date');
  
  // 2. DYNAMIC VALUE LOCALIZATION (Swaps core examples on toggle)
  if (currentLang === 'ja') {
    if (!inSender.value || inSender.value === "Alex Studio London Ltd") inSender.value = "株式会社アレックス・スタジオ・ジャパン";
    if (!inDesc.value || inDesc.value === "Systems Infrastructure Architecture & Strategy Consultation") inDesc.value = "システムインフラ基本設計およびクラウド統合戦略コンサルティング";
    if (!inPartyA.value || inPartyA.value === "Alex Studio London Ltd") inPartyA.value = "株式会社アレックス・スタジオ・ジャパン";
    if (!inPurpose.value || inPurpose.value === "Evaluation of proprietary database systems and cloud layout engineering frameworks.") inPurpose.value = "独自データベースシステムおよびクラウドレイアウトエンジニアリング基盤の評価検証。";
    
    // Convert dates to standard Asian layouts
    if (inInvDate.value === "July 10, 2026") inInvDate.value = "2026年7月10日";
    if (inConDate.value === "July 10, 2026") inConDate.value = "2026年7月10日";
  } else {
    if (inSender.value === "株式会社アレックス・スタジオ・ジャパン") inSender.value = "Alex Studio London Ltd";
    if (inDesc.value === "システムインフラ基本設計およびクラウド統合戦略コンサルティング") inDesc.value = "Systems Infrastructure Architecture & Strategy Consultation";
    if (inPartyA.value === "株式会社アレックス・スタジオ・ジャパン") inPartyA.value = "Alex Studio London Ltd";
    if (inPurpose.value === "独自データベースシステムおよびクラウドレイアウトエンジニアリング基盤の評価検証。") inPurpose.value = "Evaluation of proprietary database systems and cloud layout engineering frameworks.";
    
    // Return dates to standard American styling default
    if (inInvDate.value === "2026年7月10日") inInvDate.value = "July 10, 2026";
    if (inConDate.value === "2026年7月10日") inConDate.value = "July 10, 2026";
  }

  // 3. Update placeholder formatting hints
  const clientInput = document.getElementById('in-party-b');
  if (clientInput) {
    clientInput.placeholder = currentLang === 'ja' ? "企業名・取引先法人名を入力してください" : "Enter Corporate Client Full Entity Name";
  }

  const taxInput = document.getElementById('in-tax');
  if (taxInput) {
    taxInput.placeholder = currentLang === 'ja' ? "法人番号 / 適格請求書発行事業者登録番号 (例: T1234567890123)" : "Corporate Identification / Vat ID (e.g. GB1234567)";
  }

  // 4. Trigger structural layout synchronizations immediately
  syncInvoiceData();
  syncContractData();
}

function syncInvoiceData() {
  const sender = document.getElementById('in-sender').value || '---';
  const tax = document.getElementById('in-tax').value;
  const desc = document.getElementById('in-desc').value || '---';
  const curr = document.getElementById('in-curr').value;
  const price = parseFloat(document.getElementById('in-price').value) || 0;
  const dateVal = document.getElementById('in-invoice-date').value || '---';

  document.getElementById('out-sender').innerText = sender;
  document.getElementById('out-tax').innerText = tax ? "Tax ID: " + tax : (currentLang === 'ja' ? "登録番号: 未設定" : "Tax ID: Not Set");
  document.getElementById('out-desc').innerText = desc;
  document.getElementById('invoice-date-out').innerText = dateVal;
  
  const combinedVal = curr + price.toLocaleString();
  document.getElementById('out-price').innerText = combinedVal;
  document.getElementById('out-total').innerText = combinedVal;
}

function syncContractData() {
  const partyA = document.getElementById('in-party-a').value || '---';
  const partyB = document.getElementById('in-party-b').value || (currentLang === 'ja' ? '[受領当事者名称]' : '[Receiving Party Entity]');
  const purpose = document.getElementById('in-purpose').value || '---';
  const dateVal = document.getElementById('in-contract-date').value || '---';

  document.getElementById('out-party-a').innerText = partyA;
  document.getElementById('out-party-b').innerText = partyB;
  document.getElementById('out-purpose').innerText = purpose;
  document.getElementById('contract-date-out').innerText = dateVal;
}

// Bind initialization functions on startup pipeline loop
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(syncInvoiceData, 200);
  setTimeout(syncContractData, 200);
});
