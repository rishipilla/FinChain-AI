/**
 * FinChain AI - Client Orchestrator & Controller
 * 
 * Handles DOM actions, charts, router transitions, calculators, and API interfaces.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------------------------------------------
  // STATE MANAGEMENT
  // -----------------------------------------------------------------
  let appState = {
    currentUser: null,
    dashboard: null,
    transactions: [],
    blockchainLedger: [],
    settings: {},
    activeView: 'dashboard',
    sidebarCollapsed: false,
    theme: 'dark',
    chatHistory: [],
    activeChatId: null,
    computedFileHash: null
  };

  // -----------------------------------------------------------------
  // DOM ELEMENT SELECTORS
  // -----------------------------------------------------------------
  const elements = {
    authPortal: document.getElementById('auth-portal'),
    loginSection: document.getElementById('login-section'),
    registerSection: document.getElementById('register-section'),
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    btnSubmitLogin: document.getElementById('btn-submit-login'),
    btnSubmitRegister: document.getElementById('btn-submit-register'),
    switchToRegister: document.getElementById('switch-to-register'),
    switchToLogin: document.getElementById('switch-to-login'),
    
    sidebar: document.getElementById('sidebar'),
    sidebarToggleBtn: document.getElementById('sidebar-toggle-btn'),
    collapseIcon: document.getElementById('collapse-icon'),
    sidebarUserName: document.getElementById('sidebar-user-name'),
    sidebarUserRole: document.getElementById('sidebar-user-role'),
    sidebarLogoutBtn: document.getElementById('sidebar-logout-btn'),
    
    navGreetingTitle: document.getElementById('navbar-greeting-title'),
    navCurrentDate: document.getElementById('navbar-current-date'),
    globalSearchInput: document.getElementById('global-search-input'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeIcon: document.getElementById('theme-icon'),
    notificationBellBtn: document.getElementById('notification-bell-btn'),
    notificationPanel: document.getElementById('notification-panel'),
    notificationList: document.getElementById('notification-list'),
    apiStatusIndicator: document.getElementById('api-status-indicator'),
    
    // View Selectors
    navItems: document.querySelectorAll('.nav-item'),
    views: document.querySelectorAll('.app-view'),
    
    // Dashboard Stats
    dashTotalIncome: document.getElementById('dash-total-income'),
    dashTotalExpense: document.getElementById('dash-total-expense'),
    dashTotalSavings: document.getElementById('dash-total-savings'),
    dashEstimatedTax: document.getElementById('dash-estimated-tax'),
    dashHealthScore: document.getElementById('dash-health-score'),
    dashBlockchainStatus: document.getElementById('dash-blockchain-status'),
    dashBlockchainBlock: document.getElementById('dash-blockchain-block'),
    dashRecentUploads: document.getElementById('dash-recent-uploads'),
    
    // Transactions
    txTableBody: document.getElementById('tx-table-body'),
    txSearchInput: document.getElementById('tx-search-input'),
    txFilterCategory: document.getElementById('tx-filter-category'),
    txFilterMode: document.getElementById('tx-filter-mode'),
    btnClearTxFilters: document.getElementById('btn-clear-tx-filters'),
    btnAddTransaction: document.getElementById('btn-add-transaction'),
    modalAddTx: document.getElementById('modal-add-tx'),
    addTxForm: document.getElementById('add-tx-form'),
    txPaginationInfo: document.getElementById('tx-pagination-info'),
    txBtnPrev: document.getElementById('tx-btn-prev'),
    txBtnNext: document.getElementById('tx-btn-next'),
    
    // Tax View
    taxGrossIncome: document.getElementById('tax-gross-income'),
    taxSec80c: document.getElementById('tax-sec-80c'),
    taxSec80d: document.getElementById('tax-sec-80d'),
    taxOtherDeductions: document.getElementById('tax-other-deductions'),
    btnRecalculateTax: document.getElementById('btn-recalculate-tax'),
    btnExportTaxPdf: document.getElementById('btn-export-tax-pdf'),
    taxSavedTotal: document.getElementById('tax-saved-total'),
    
    // Dedicated AI Chat
    dedicatedChatMessages: document.getElementById('dedicated-chat-messages'),
    dedicatedChatInput: document.getElementById('dedicated-chat-input'),
    btnSendMessage: document.getElementById('btn-send-message'),
    btnChatVoice: document.getElementById('btn-chat-voice'),
    chatSuggestedPrompts: document.getElementById('chat-suggested-prompts'),
    btnExportChat: document.getElementById('btn-export-chat'),
    btnClearChat: document.getElementById('btn-clear-chat'),
    chatHistoryList: document.getElementById('chat-history-list'),
    btnNewChat: document.getElementById('btn-new-chat'),
    
    // Floating AI Chat widget
    btnFloatingToggle: document.getElementById('btn-floating-toggle'),
    floatingChatPanel: document.getElementById('floating-chat-panel'),
    btnFloatingClose: document.getElementById('btn-floating-close'),
    floatingChatMessages: document.getElementById('floating-chat-messages'),
    floatingChatInput: document.getElementById('floating-chat-input'),
    btnFloatingSend: document.getElementById('btn-floating-send'),
    
    // Upload View
    uploadDropzone: document.getElementById('upload-dropzone'),
    fileUploaderInput: document.getElementById('file-uploader-input'),
    uploadProgressContainer: document.getElementById('upload-progress-container'),
    uploadProgressFill: document.getElementById('upload-progress-fill'),
    uploadFilePreviews: document.getElementById('upload-file-previews'),
    
    // UPI View
    linkedBanksList: document.getElementById('linked-banks-list'),
    btnAddBank: document.getElementById('btn-add-bank'),
    modalAddBank: document.getElementById('modal-add-bank'),
    addBankForm: document.getElementById('add-bank-form'),
    
    // Blockchain View
    blockchainDropzone: document.getElementById('blockchain-dropzone'),
    blockchainFileInput: document.getElementById('blockchain-file-input'),
    bcComputedHash: document.getElementById('bc-computed-hash'),
    btnStoreOnBlockchain: document.getElementById('btn-store-on-blockchain'),
    btnCopyHash: document.getElementById('btn-copy-hash'),
    bcLedgerHeight: document.getElementById('bc-ledger-height'),
    bcLedgerBody: document.getElementById('bc-ledger-body'),
    
    // Downloads View
    downloadsGridContent: document.getElementById('downloads-grid-content'),
    
    // Profile View
    profileAvatarLarge: document.getElementById('profile-avatar-large'),
    profileBadgeLabel: document.getElementById('profile-badge-label'),
    profileNameInput: document.getElementById('profile-name-input'),
    profileEmailInput: document.getElementById('profile-email-input'),
    profilePhoneInput: document.getElementById('profile-phone-input'),
    profilePanInput: document.getElementById('profile-pan-input'),
    profileAadhaarInput: document.getElementById('profile-aadhaar-input'),
    profileJobInput: document.getElementById('profile-job-input'),
    btnEditProfile: document.getElementById('btn-edit-profile'),
    btnSaveProfile: document.getElementById('btn-save-profile'),
    
    // Settings View
    settingsDarkmodeCheckbox: document.getElementById('settings-darkmode-checkbox'),
    settingsEmailCheckbox: document.getElementById('settings-email-checkbox'),
    settingsSyncCheckbox: document.getElementById('settings-sync-checkbox'),
    settings2faCheckbox: document.getElementById('settings-2fa-checkbox'),
    settingsLangSelect: document.getElementById('settings-lang-select'),
    btnDeleteProfile: document.getElementById('btn-delete-profile'),
    
    // Global Elements
    toastContainer: document.getElementById('toast-container')
  };

  // -----------------------------------------------------------------
  // CHART INITIALIZERS
  // -----------------------------------------------------------------
  let charts = {
    incomeExpense: null,
    monthlySpending: null,
    expenseDoughnut: null,
    taxComparison: null,
    taxRegimeComparison: null // inside Tax View
  };

  function initCharts() {
    // Destroy existing to avoid memory leaks/re-renders
    Object.keys(charts).forEach(key => {
      if (charts[key]) charts[key].destroy();
    });

    const isDark = document.body.classList.contains('dark-mode');
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    const textColor = isDark ? '#CBD5E1' : '#475569';

    // Chart.js Default styling configs
    Chart.defaults.color = textColor;
    Chart.defaults.font.family = "'Poppins', sans-serif";

    // 1. Income vs Expense Trend Line Spline
    const ctxIE = document.getElementById('incomeExpenseChart')?.getContext('2d');
    if (ctxIE) {
      charts.incomeExpense = new Chart(ctxIE, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Monthly Income',
              data: appState.dashboard.monthlyIncome,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Monthly Expenses',
              data: appState.dashboard.monthlySpending,
              borderColor: '#EF4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' }
          },
          scales: {
            x: { grid: { color: gridColor } },
            y: { grid: { color: gridColor } }
          }
        }
      });
    }

    // 2. Monthly Spending Bar Chart
    const ctxMS = document.getElementById('monthlySpendingChart')?.getContext('2d');
    if (ctxMS) {
      charts.monthlySpending = new Chart(ctxMS, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Total Expenses',
            data: appState.dashboard.monthlySpending,
            backgroundColor: '#3B82F6',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: gridColor } }
          }
        }
      });
    }

    // 3. Expense Categories Doughnut Chart
    const ctxED = document.getElementById('expenseDoughnutChart')?.getContext('2d');
    if (ctxED) {
      const keys = Object.keys(appState.dashboard.expenseCategories);
      const vals = Object.values(appState.dashboard.expenseCategories);
      charts.expenseDoughnut = new Chart(ctxED, {
        type: 'doughnut',
        data: {
          labels: keys,
          datasets: [{
            data: vals,
            backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#06B6D4'],
            borderWidth: isDark ? 2 : 1,
            borderColor: isDark ? '#1E293B' : '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 12 } }
          }
        }
      });
    }

    // 4. Old vs New Tax Regime Comparison inside Dashboard
    const ctxTC = document.getElementById('taxComparisonChart')?.getContext('2d');
    if (ctxTC) {
      charts.taxComparison = new Chart(ctxTC, {
        type: 'bar',
        data: {
          labels: ['Old Tax Regime', 'New Tax Regime'],
          datasets: [{
            label: 'Estimated Annual Tax Liability',
            data: [21450, 18200],
            backgroundColor: ['#64748B', '#2563EB'],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: gridColor } }
          }
        }
      });
    }

    // 5. Tax Regime Comparison inside Tax View
    const ctxTR = document.getElementById('taxRegimeComparisonChart')?.getContext('2d');
    if (ctxTR) {
      const gross = parseFloat(elements.taxGrossIncome.value) || 125000;
      const sec80c = parseFloat(elements.taxSec80c.value) || 1800;
      const sec80d = parseFloat(elements.taxSec80d.value) || 600;
      const other = parseFloat(elements.taxOtherDeductions.value) || 1200;

      // Simple mock calculations based on values
      const oldTax = Math.max(0, (gross - sec80c - sec80d - other) * 0.18);
      const newTax = Math.max(0, (gross - 600) * 0.15); // standard deduction under new regime

      charts.taxRegimeComparison = new Chart(ctxTR, {
        type: 'bar',
        data: {
          labels: ['Gross Income', 'Deductions Applied', 'Net Taxable', 'Estimated Tax Liability'],
          datasets: [
            {
              label: 'Old Regime (with Deductions)',
              data: [gross, sec80c + sec80d + other, gross - (sec80c + sec80d + other), oldTax],
              backgroundColor: '#8B5CF6',
              borderRadius: 6
            },
            {
              label: 'New Regime (Flat rates)',
              data: [gross, 600, gross - 600, newTax],
              backgroundColor: '#3B82F6',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: gridColor } }
          }
        }
      });

      // Update text UI values
      const saved = oldTax - newTax;
      if (saved > 0) {
        elements.taxSavedTotal.textContent = `$${saved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        elements.taxSavedTotal.textContent = `$0.00`;
      }
    }
  }

  // -----------------------------------------------------------------
  // SYSTEM & ROUTER INITIALIZATION
  // -----------------------------------------------------------------
  async function initializeApp() {
    setupDateTime();
    setupEventHandlers();

    // Check Login status
    if (apiClient.isLoggedIn()) {
      showMainDashboard();
    } else {
      showAuthPortal();
    }
  }

  function setupDateTime() {
    const formatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-US', formatOptions);
    elements.navCurrentDate.textContent = dateStr;
  }

  function showAuthPortal() {
    elements.authPortal.classList.remove('hidden');
  }

  function hideAuthPortal() {
    elements.authPortal.classList.add('hidden');
  }

  async function showMainDashboard() {
    hideAuthPortal();
    
    // Pull logged-in profile
    const profile = await apiClient.getProfile();
    appState.currentUser = profile;

    // Fill profile fields
    elements.sidebarUserName.textContent = profile.name;
    elements.navGreetingTitle.textContent = `Hello, ${profile.name.split(' ')[0]}`;
    
    // Populate profile inputs
    elements.profileNameInput.value = profile.name;
    elements.profileEmailInput.value = profile.email;
    elements.profilePhoneInput.value = profile.phone;
    elements.profilePanInput.value = profile.pan;
    elements.profileAadhaarInput.value = profile.aadhaar;
    elements.profileJobInput.value = profile.occupation;
    elements.profileBadgeLabel.textContent = profile.badge;

    // Synchronize global states
    await reloadDashboardStats();
    await reloadTransactions();
    await reloadBlockchainLedger();
    await reloadUPIProviders();
    await reloadDownloads();
    reloadChatHistory();

    // Load initial settings checkboxes
    const storedSettings = JSON.parse(localStorage.getItem('fc_settings'));
    if (storedSettings) {
      appState.settings = storedSettings;
      elements.settingsDarkmodeCheckbox.checked = storedSettings.darkMode;
      elements.settingsEmailCheckbox.checked = storedSettings.emailNotifications;
      elements.settingsSyncCheckbox.checked = storedSettings.autoSyncUPI;
      elements.settings2faCheckbox.checked = storedSettings.twoFactorAuth;
      elements.settingsLangSelect.value = storedSettings.reportingLanguage;
      
      toggleTheme(storedSettings.darkMode);
    }

    // Refresh layout sizing/rendering
    setTimeout(() => {
      initCharts();
    }, 100);

    createToast('Access Granted. Session synchronised with node.', 'success');
  }

  // -----------------------------------------------------------------
  // REFRESH & FETCH METHODS
  // -----------------------------------------------------------------
  async function reloadDashboardStats() {
    const dash = await apiClient.getDashboardData();
    appState.dashboard = dash;

    // Animated numerical numbers update
    animateValue(elements.dashTotalIncome, 0, dash.totalIncome, 1000, '$');
    animateValue(elements.dashTotalExpense, 0, dash.totalExpense, 1000, '$');
    animateValue(elements.dashTotalSavings, 0, dash.totalSavings, 1000, '$');
    animateValue(elements.dashEstimatedTax, 0, dash.estimatedTax, 1000, '$');
    
    elements.dashHealthScore.textContent = `${dash.healthScore} / 100`;
    elements.dashBlockchainStatus.textContent = dash.blockchainStatus;

    // Fill recent uploads templates
    elements.dashRecentUploads.innerHTML = '';
    dash.recentUploads.forEach(file => {
      const fileCard = document.createElement('div');
      fileCard.className = 'file-preview-card';
      fileCard.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <i class="fa-solid fa-file-pdf" style="color: #EF4444; font-size:18px;"></i>
          <div style="display:flex; flex-direction:column;">
            <span style="font-weight:600;">${file.name}</span>
            <span style="font-size:10px; color:var(--text-muted);">Uploaded on ${file.date}</span>
          </div>
        </div>
        <span class="status-badge success">${file.status}</span>
      `;
      elements.dashRecentUploads.appendChild(fileCard);
    });
  }

  // Reloads transactions with table pagination & filters
  let txPage = 1;
  const txPerPage = 8;
  let sortedColumn = 'date';
  let sortDirection = 'desc';

  async function reloadTransactions() {
    let txs = JSON.parse(localStorage.getItem('fc_transactions') || '[]');
    
    // Apply filters
    const searchVal = elements.txSearchInput.value.toLowerCase();
    const categoryFilter = elements.txFilterCategory.value;
    const modeFilter = elements.txFilterMode.value;

    if (searchVal) {
      txs = txs.filter(t => t.merchant.toLowerCase().includes(searchVal) || t.amount.toString().includes(searchVal));
    }
    if (categoryFilter !== 'All') {
      txs = txs.filter(t => t.category === categoryFilter);
    }
    if (modeFilter !== 'All') {
      txs = txs.filter(t => t.mode === modeFilter);
    }

    // Apply sorting
    txs.sort((a, b) => {
      let valA = a[sortedColumn];
      let valB = b[sortedColumn];

      if (sortedColumn === 'amount') {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    appState.transactions = txs;

    // Render table
    const startIdx = (txPage - 1) * txPerPage;
    const paginatedTxs = txs.slice(startIdx, startIdx + txPerPage);

    elements.txTableBody.innerHTML = '';
    if (paginatedTxs.length === 0) {
      elements.txTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">
            <i class="fa-solid fa-receipt" style="font-size: 24px; margin-bottom: 8px;"></i>
            <p>No transactions found matching the audit search</p>
          </td>
        </tr>
      `;
    } else {
      paginatedTxs.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${tx.date}</td>
          <td style="font-weight:600;">${tx.merchant}</td>
          <td><span style="background:var(--accent-light); color:var(--primary); padding:3px 8px; border-radius:6px; font-size:11px;">${tx.category}</span></td>
          <td style="font-weight:700;">$${tx.amount.toFixed(2)}</td>
          <td>${tx.mode}</td>
          <td><span class="status-badge success">${tx.status}</span></td>
          <td>
            <button class="btn-icon-only btn-delete-tx" data-id="${tx.id}" style="color:var(--danger); border-color:var(--card-border);" title="Delete Record">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        `;
        elements.txTableBody.appendChild(row);
      });
    }

    // Pagination info & buttons
    const totalRecords = txs.length;
    const endIdx = Math.min(startIdx + txPerPage, totalRecords);
    elements.txPaginationInfo.textContent = totalRecords > 0 
      ? `Showing ${startIdx + 1} to ${endIdx} of ${totalRecords} transactions`
      : 'Showing 0 to 0 of 0 transactions';

    elements.txBtnPrev.disabled = txPage <= 1;
    elements.txBtnNext.disabled = endIdx >= totalRecords;
  }

  // Reload receipts history
  async function reloadBlockchainLedger() {
    const ledger = JSON.parse(localStorage.getItem('fc_blockchain_ledger') || '[]');
    appState.blockchainLedger = ledger;

    elements.bcLedgerBody.innerHTML = '';
    if (ledger.length === 0) {
      elements.bcLedgerBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No records registered on-chain</td></tr>';
      return;
    }

    ledger.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="font-family:monospace;">${entry.txId}</td>
        <td>${entry.timestamp}</td>
        <td style="font-family:monospace; font-size:11px;">${entry.hash.substring(0, 16)}...${entry.hash.substring(48)}</td>
        <td>${entry.blockNumber}</td>
        <td><span class="status-badge success">${entry.status}</span></td>
        <td>
          <button class="btn-icon-only btn-download-cert" data-hash="${entry.hash}" style="padding: 4px;" title="Download ITR Certificate">
            <i class="fa-solid fa-file-contract"></i>
          </button>
        </td>
      `;
      elements.bcLedgerBody.appendChild(row);
    });

    if (ledger.length > 0) {
      elements.bcLedgerHeight.textContent = ledger[0].blockNumber;
      elements.dashBlockchainBlock.textContent = `Block #${ledger[0].blockNumber}`;
    }
  }

  // Reload UPI Providers list
  async function reloadUPIProviders() {
    const upis = JSON.parse(localStorage.getItem('fc_upi_accounts') || '[]');
    
    // Set cards statuses
    const gpay = upis.find(u => u.app === 'Google Pay');
    const phonepe = upis.find(u => u.app === 'PhonePe');
    const paytm = upis.find(u => u.app === 'Paytm');
    const bhim = upis.find(u => u.app === 'BHIM');

    updateUpiBadge(document.getElementById('status-gpay'), gpay ? gpay.connected : false);
    updateUpiBadge(document.getElementById('status-phonepe'), phonepe ? phonepe.connected : false);
    updateUpiBadge(document.getElementById('status-paytm'), paytm ? paytm.connected : false);
    updateUpiBadge(document.getElementById('status-bhim'), bhim ? bhim.connected : false);

    // Bank lists rendering
    elements.linkedBanksList.innerHTML = '';
    upis.forEach(acc => {
      const card = document.createElement('div');
      card.className = 'file-preview-card';
      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
          <i class="fa-solid fa-building-columns" style="font-size:20px; color:var(--primary);"></i>
          <div style="display:flex; flex-direction:column;">
            <span style="font-weight:600;">${acc.bankName}</span>
            <span style="font-size:11px; color:var(--text-muted);">${acc.upiId} • ${acc.accNo}</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="status-badge ${acc.connected ? 'success' : 'failed'}">${acc.connected ? 'Feed Active' : 'Disconnected'}</span>
          <button class="btn-icon-only btn-toggle-upi" data-id="${acc.id}" title="${acc.connected ? 'Disable Feed' : 'Connect Feed'}">
            <i class="fa-solid ${acc.connected ? 'fa-link-slash' : 'fa-link'}"></i>
          </button>
        </div>
      `;
      elements.linkedBanksList.appendChild(card);
    });
  }

  function updateUpiBadge(badgeEl, isConnected) {
    if (!badgeEl) return;
    if (isConnected) {
      badgeEl.className = 'connected-badge connected';
      badgeEl.textContent = 'Connected';
    } else {
      badgeEl.className = 'connected-badge disconnected';
      badgeEl.textContent = 'Disconnected';
    }
  }

  // Reload Downloads view content
  async function reloadDownloads() {
    const data = await apiClient.getReports();
    elements.downloadsGridContent.innerHTML = '';
    
    data.reports.forEach(rep => {
      const card = document.createElement('div');
      card.className = 'glass-card download-card';
      card.innerHTML = `
        <div class="download-icon-box">
          <i class="fa-solid ${rep.type === 'PDF' ? 'fa-file-pdf' : 'fa-file-csv'}"></i>
        </div>
        <div class="download-info">
          <span class="title">${rep.title}</span>
          <span class="meta">${rep.type} • ${rep.size} • ${rep.date}</span>
        </div>
        <button class="btn-icon-only btn-download-file" data-id="${rep.id}" title="Download Report"><i class="fa-solid fa-circle-down"></i></button>
      `;
      elements.downloadsGridContent.appendChild(card);
    });
  }

  // Reload chat histories sidebar
  function reloadChatHistory() {
    const list = JSON.parse(localStorage.getItem('fc_chat_history') || '[]');
    appState.chatHistory = list;

    elements.chatHistoryList.innerHTML = '';
    if (list.length === 0) {
      elements.chatHistoryList.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:12px;">No chats recorded</p>';
      return;
    }

    list.forEach(c => {
      const item = document.createElement('div');
      item.className = `history-item ${c.id === appState.activeChatId ? 'active' : ''}`;
      item.dataset.id = c.id;
      item.innerHTML = `
        <div class="history-item-meta">
          <span class="history-item-title">${c.title}</span>
          <span class="history-item-date">${new Date(c.timestamp).toLocaleDateString()}</span>
        </div>
        <i class="fa-solid fa-trash-can history-item-delete" data-id="${c.id}"></i>
      `;
      elements.chatHistoryList.appendChild(item);
    });
  }

  // -----------------------------------------------------------------
  // EVENT HANDLERS SETUP
  // -----------------------------------------------------------------
  function setupEventHandlers() {
    // 1. Auth Page Toggles
    elements.switchToRegister.addEventListener('click', () => {
      elements.loginSection.style.display = 'none';
      elements.registerSection.style.display = 'block';
    });
    elements.switchToLogin.addEventListener('click', () => {
      elements.registerSection.style.display = 'none';
      elements.loginSection.style.display = 'block';
    });

    // Submit actions
    elements.loginForm.addEventListener('submit', async () => {
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      
      elements.btnSubmitLogin.textContent = 'Authenticating...';
      elements.btnSubmitLogin.disabled = true;

      try {
        await apiClient.login(email, pass);
        await showMainDashboard();
      } catch (err) {
        createToast(err.message, 'danger');
        elements.btnSubmitLogin.textContent = 'Log In';
        elements.btnSubmitLogin.disabled = false;
      }
    });

    elements.registerForm.addEventListener('submit', async () => {
      const username = document.getElementById('register-username').value;
      const email = document.getElementById('register-email').value;
      const pass = document.getElementById('register-password').value;

      elements.btnSubmitRegister.textContent = 'Creating account...';
      elements.btnSubmitRegister.disabled = true;

      try {
        await apiClient.register(username, email, pass);
        await showMainDashboard();
      } catch (err) {
        createToast(err.message, 'danger');
        elements.btnSubmitRegister.textContent = 'Sign Up';
        elements.btnSubmitRegister.disabled = false;
      }
    });

    // Sidebar collapse/expand
    elements.sidebarToggleBtn.addEventListener('click', () => {
      appState.sidebarCollapsed = !appState.sidebarCollapsed;
      elements.sidebar.classList.toggle('collapsed', appState.sidebarCollapsed);
      elements.collapseIcon.className = appState.sidebarCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left';
      
      // Delay to allow CSS transition to finish before charts resize
      setTimeout(() => {
        if (charts.incomeExpense) charts.incomeExpense.resize();
        if (charts.monthlySpending) charts.monthlySpending.resize();
        if (charts.expenseDoughnut) charts.expenseDoughnut.resize();
        if (charts.taxComparison) charts.taxComparison.resize();
      }, 350);
    });

    // Logout
    elements.sidebarLogoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      apiClient.logout();
      appState.currentUser = null;
      showAuthPortal();
      createToast('Session terminated.', 'warning');
    });

    // Main navigation router tabs switches
    elements.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = item.dataset.view;
        switchView(targetView);
      });
    });

    // Theme toggler
    elements.themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      toggleTheme(!isDark);
    });

    // API status state listener
    window.addEventListener('api-status-changed', (e) => {
      elements.apiStatusIndicator.style.display = e.detail.offline ? 'flex' : 'none';
    });

    // Notification dropdown toggle
    elements.notificationBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.notificationPanel.classList.toggle('active');
      
      // Seed notifications if empty
      if (elements.notificationPanel.classList.contains('active')) {
        renderNotifications();
      }
    });

    document.addEventListener('click', () => {
      elements.notificationPanel.classList.remove('active');
    });

    // 2. Global search handling
    elements.globalSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) return;

      // Check if matches sidebar routes or direct keywords
      if (query === 'tax' || query === 'regime') {
        switchView('tax');
      } else if (query === 'chat' || query === 'assistant' || query === 'ai') {
        switchView('assistant');
      } else if (query === 'upload' || query === 'file') {
        switchView('upload');
      } else if (query === 'upi' || query === 'bank') {
        switchView('upi');
      } else if (query === 'security' || query === 'password' || query === 'dark') {
        switchView('settings');
      } else {
        // Assume merchant transaction query, redirect to transaction list
        elements.txSearchInput.value = query;
        switchView('transactions');
        reloadTransactions();
      }
    });

    // 3. Transactions List actions
    elements.txSearchInput.addEventListener('input', () => {
      txPage = 1;
      reloadTransactions();
    });
    elements.txFilterCategory.addEventListener('change', () => {
      txPage = 1;
      reloadTransactions();
    });
    elements.txFilterMode.addEventListener('change', () => {
      txPage = 1;
      reloadTransactions();
    });
    elements.btnClearTxFilters.addEventListener('click', () => {
      elements.txSearchInput.value = '';
      elements.txFilterCategory.value = 'All';
      elements.txFilterMode.value = 'All';
      txPage = 1;
      reloadTransactions();
    });

    elements.txBtnPrev.addEventListener('click', () => {
      if (txPage > 1) {
        txPage--;
        reloadTransactions();
      }
    });
    elements.txBtnNext.addEventListener('click', () => {
      txPage++;
      reloadTransactions();
    });

    // Add manual record modal
    elements.btnAddTransaction.addEventListener('click', () => {
      elements.modalAddTx.classList.add('active');
      document.getElementById('new-tx-date').value = new Date().toISOString().split('T')[0];
    });

    elements.addTxForm.addEventListener('submit', async () => {
      const merchant = document.getElementById('new-tx-merchant').value;
      const amount = parseFloat(document.getElementById('new-tx-amount').value);
      const category = document.getElementById('new-tx-category').value;
      const mode = document.getElementById('new-tx-mode').value;
      const date = document.getElementById('new-tx-date').value;

      const newTx = {
        id: 'tx_' + Date.now(),
        merchant,
        amount,
        category,
        mode,
        date,
        status: 'Success'
      };

      // Push into state & update local storage
      const txs = JSON.parse(localStorage.getItem('fc_transactions') || '[]');
      txs.unshift(newTx);
      localStorage.setItem('fc_transactions', JSON.stringify(txs));

      // Re-calculate dashboard figures
      const dash = JSON.parse(localStorage.getItem('fc_dashboard_data'));
      dash.totalExpense += amount;
      dash.totalSavings = dash.totalIncome - dash.totalExpense;
      dash.monthlySpending[dash.monthlySpending.length - 1] += amount;
      
      // Category update
      if (dash.expenseCategories[category] !== undefined) {
        dash.expenseCategories[category] += amount;
      } else {
        dash.expenseCategories[category] = amount;
      }
      localStorage.setItem('fc_dashboard_data', JSON.stringify(dash));

      // Reset & refresh views
      elements.modalAddTx.classList.remove('active');
      elements.addTxForm.reset();
      createToast('Audit ledger updated with new record.', 'success');
      
      await reloadDashboardStats();
      await reloadTransactions();
      initCharts();
    });

    // Delete transaction listener (delegated)
    elements.txTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-delete-tx');
      if (!btn) return;
      const id = btn.dataset.id;
      
      let txs = JSON.parse(localStorage.getItem('fc_transactions') || '[]');
      const found = txs.find(t => t.id === id);
      if (found) {
        txs = txs.filter(t => t.id !== id);
        localStorage.setItem('fc_transactions', JSON.stringify(txs));

        // Adjust dashboard variables
        const dash = JSON.parse(localStorage.getItem('fc_dashboard_data'));
        dash.totalExpense -= found.amount;
        dash.totalSavings = dash.totalIncome - dash.totalExpense;
        dash.monthlySpending[dash.monthlySpending.length - 1] -= found.amount;
        if (dash.expenseCategories[found.category] !== undefined) {
          dash.expenseCategories[found.category] = Math.max(0, dash.expenseCategories[found.category] - found.amount);
        }
        localStorage.setItem('fc_dashboard_data', JSON.stringify(dash));

        createToast('Record deleted and ledger recalculated.', 'warning');
        reloadDashboardStats();
        reloadTransactions();
        initCharts();
      }
    });

    // Sorting columns click listeners
    document.querySelectorAll('.tx-table th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.sort;
        if (sortedColumn === col) {
          sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          sortedColumn = col;
          sortDirection = 'asc';
        }
        
        // Reset chevron icons
        document.querySelectorAll('.tx-table th i').forEach(icon => {
          icon.className = 'fa-solid fa-sort';
        });
        const currentIcon = th.querySelector('i');
        currentIcon.className = sortDirection === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down';
        
        reloadTransactions();
      });
    });

    // 4. Tax Optimization Form
    elements.btnRecalculateTax.addEventListener('click', () => {
      initCharts();
      createToast('Regime analysis optimized with custom limits.', 'success');
    });

    elements.btnExportTaxPdf.addEventListener('click', () => {
      simulateDownload('FY2026-ITR_Calculation_Receipt.pdf', 'Tax Optimization Plan exported successfully to PDF format.');
    });

    // 5. Dedicated chatbot listeners
    elements.btnSendMessage.addEventListener('click', () => submitChatInput(elements.dedicatedChatInput, elements.dedicatedChatMessages));
    elements.dedicatedChatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitChatInput(elements.dedicatedChatInput, elements.dedicatedChatMessages);
      }
    });

    // Clear chatbot logs
    elements.btnClearChat.addEventListener('click', () => {
      elements.dedicatedChatMessages.innerHTML = '';
      createToast('Dedicated chat conversation cleared.', 'warning');
    });

    // Export chatbot dialogue transcript
    elements.btnExportChat.addEventListener('click', () => {
      const msgs = elements.dedicatedChatMessages.querySelectorAll('.chat-msg');
      if (msgs.length === 0) {
        createToast('Cannot export empty conversation logs.', 'danger');
        return;
      }
      let exportStr = `--- FinChain AI - Audit Conversation Transcript ---\nDate: ${new Date().toLocaleString()}\n\n`;
      msgs.forEach(m => {
        const isUser = m.classList.contains('user-msg');
        const sender = isUser ? 'User' : 'FinChain AI';
        const txt = m.querySelector('.msg-bubble').textContent.trim();
        exportStr += `${sender}: ${txt}\n\n`;
      });

      const blob = new Blob([exportStr], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `finchain-audit-chat-${Date.now()}.txt`;
      link.click();
      createToast('Conversation logs downloaded as text file.', 'success');
    });

    // New chat sidebar button
    elements.btnNewChat.addEventListener('click', () => {
      appState.activeChatId = 'chat_' + Date.now();
      const list = JSON.parse(localStorage.getItem('fc_chat_history') || '[]');
      const newConvo = { id: appState.activeChatId, title: 'New Conversation ' + (list.length + 1), timestamp: Date.now() };
      list.unshift(newConvo);
      localStorage.setItem('fc_chat_history', JSON.stringify(list));
      
      elements.dedicatedChatMessages.innerHTML = '';
      reloadChatHistory();
      addBotMessage(elements.dedicatedChatMessages, 'Hi there! I am FinChain AI, your intelligent financial audit and tax optimization assistant. Ask me anything about Section 80C deductions, suspicious bills, or monthly balances.');
    });

    // Suggested prompts click
    elements.chatSuggestedPrompts.addEventListener('click', (e) => {
      const tag = e.target.closest('.prompt-tag');
      if (!tag) return;
      const text = tag.dataset.prompt;
      elements.dedicatedChatInput.value = text;
      submitChatInput(elements.dedicatedChatInput, elements.dedicatedChatMessages);
    });

    // Sidebar history select/delete
    elements.chatHistoryList.addEventListener('click', (e) => {
      const delBtn = e.target.closest('.history-item-delete');
      if (delBtn) {
        e.stopPropagation();
        const id = delBtn.dataset.id;
        let list = JSON.parse(localStorage.getItem('fc_chat_history') || '[]');
        list = list.filter(c => c.id !== id);
        localStorage.setItem('fc_chat_history', JSON.stringify(list));
        if (appState.activeChatId === id) {
          appState.activeChatId = null;
          elements.dedicatedChatMessages.innerHTML = '';
        }
        reloadChatHistory();
        createToast('Conversation template deleted.', 'warning');
        return;
      }

      const item = e.target.closest('.history-item');
      if (!item) return;
      appState.activeChatId = item.dataset.id;
      document.querySelectorAll('.history-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      elements.dedicatedChatMessages.innerHTML = '';
      
      // Seed initial simulated text
      addBotMessage(elements.dedicatedChatMessages, `Resumed "${item.querySelector('.history-item-title').textContent}". Ask me anything!`);
    });

    // Voice assistant synthesizer/recognition simulation
    elements.btnChatVoice.addEventListener('click', () => {
      const isVoiceActive = elements.btnChatVoice.classList.contains('voice-active');
      if (isVoiceActive) {
        elements.btnChatVoice.classList.remove('voice-active');
        createToast('Voice synthesizer listening deactivated.', 'warning');
      } else {
        elements.btnChatVoice.classList.add('voice-active');
        createToast('Listening to microphone voice feedback... Speak now', 'success');
        
        // Simulating speech to text input after short delay
        setTimeout(() => {
          elements.btnChatVoice.classList.remove('voice-active');
          elements.dedicatedChatInput.value = 'How can I save tax?';
          createToast('Voice captured: "How can I save tax?"', 'success');
        }, 3000);
      }
    });

    // 6. Floating chat drawer widget
    elements.btnFloatingToggle.addEventListener('click', () => {
      const isActive = elements.floatingChatPanel.classList.contains('active');
      if (!isActive && elements.floatingChatMessages.children.length === 0) {
        addBotMessage(elements.floatingChatMessages, 'Hello, premium auditor. I am FinChain AI. Type details below to query our local database feeds.');
      }
      elements.floatingChatPanel.classList.toggle('active');
    });

    elements.btnFloatingClose.addEventListener('click', () => {
      elements.floatingChatPanel.classList.remove('active');
    });

    elements.btnFloatingSend.addEventListener('click', () => submitChatInput(elements.floatingChatInput, elements.floatingChatMessages));
    elements.floatingChatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitChatInput(elements.floatingChatInput, elements.floatingChatMessages);
      }
    });

    // 7. Statement Dropzone triggers
    elements.uploadDropzone.addEventListener('click', () => {
      elements.fileUploaderInput.click();
    });

    elements.fileUploaderInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) handleFileUpload(files[0]);
    });

    // Drag-over styling
    elements.uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      elements.uploadDropzone.classList.add('drag-over');
    });

    elements.uploadDropzone.addEventListener('dragleave', () => {
      elements.uploadDropzone.classList.remove('drag-over');
    });

    elements.uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      elements.uploadDropzone.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length > 0) handleFileUpload(files[0]);
    });

    // Delete upload item preview (delegated)
    elements.uploadFilePreviews.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-delete-file-preview');
      if (!btn) return;
      btn.closest('.file-preview-card').remove();
      createToast('Local statement file removed from parsed buffer.', 'warning');
    });

    // 8. Blockchain files dropzone
    elements.blockchainDropzone.addEventListener('click', () => {
      elements.blockchainFileInput.click();
    });

    elements.blockchainFileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) computeFileSHA256(files[0]);
    });

    elements.blockchainDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      elements.blockchainDropzone.classList.add('drag-over');
    });
    elements.blockchainDropzone.addEventListener('dragleave', () => {
      elements.blockchainDropzone.classList.remove('drag-over');
    });
    elements.blockchainDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      elements.blockchainDropzone.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length > 0) computeFileSHA256(files[0]);
    });

    // Store hash actions
    elements.btnStoreOnBlockchain.addEventListener('click', async () => {
      if (!appState.computedFileHash) return;
      
      elements.btnStoreOnBlockchain.disabled = true;
      elements.btnStoreOnBlockchain.textContent = 'Storing Hash...';

      try {
        const result = await apiClient.storeBlockchainHash({ hash: appState.computedFileHash });
        createToast(result.message, 'success');
        
        await reloadBlockchainLedger();
        await reloadDashboardStats();
      } catch (err) {
        createToast(err.message, 'danger');
      } finally {
        elements.btnStoreOnBlockchain.disabled = false;
        elements.btnStoreOnBlockchain.textContent = 'Record Hash On-Chain';
      }
    });

    elements.btnCopyHash.addEventListener('click', () => {
      const hVal = elements.bcComputedHash.textContent;
      if (hVal === '0x-') return;
      navigator.clipboard.writeText(hVal);
      createToast('Hash copied to clipboard.', 'success');
    });

    // Certificate downloads (delegated)
    elements.bcLedgerBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-download-cert');
      if (!btn) return;
      simulateDownload('Verification_Ledger_Receipt.pdf', 'Verification Certificate PDF exported successfully.');
    });

    // Downloads list triggers (delegated)
    elements.downloadsGridContent.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-download-file');
      if (!btn) return;
      simulateDownload('FinChain-Report.pdf', 'Report bundle compiled and downloaded successfully.');
    });

    // 9. UPI Bank Account bindings modal
    elements.btnAddBank.addEventListener('click', () => {
      elements.modalAddBank.classList.add('active');
    });

    elements.addBankForm.addEventListener('submit', () => {
      const bank = document.getElementById('bank-select-list').value;
      const acc = document.getElementById('bank-acc-no').value;
      const upi = document.getElementById('bank-upi-id').value;
      const app = document.getElementById('bank-provider-app').value;

      const newBank = {
        id: 'bank_' + Date.now(),
        bankName: bank,
        accNo: acc,
        upiId: upi,
        connected: true,
        app
      };

      const upis = JSON.parse(localStorage.getItem('fc_upi_accounts') || '[]');
      upis.push(newBank);
      localStorage.setItem('fc_upi_accounts', JSON.stringify(upis));

      elements.modalAddBank.classList.remove('active');
      elements.addBankForm.reset();
      createToast(`Connected ${bank} secure credentials feed via ${app}.`, 'success');

      reloadUPIProviders();
    });

    // Toggle feeds status (delegated)
    elements.linkedBanksList.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-toggle-upi');
      if (!btn) return;
      const id = btn.dataset.id;
      
      const upis = JSON.parse(localStorage.getItem('fc_upi_accounts') || '[]');
      const found = upis.find(u => u.id === id);
      if (found) {
        found.connected = !found.connected;
        localStorage.setItem('fc_upi_accounts', JSON.stringify(upis));
        
        const stateWord = found.connected ? 'activated' : 'deactivated';
        createToast(`UPI link feed for ${found.bankName} has been ${stateWord}.`, 'warning');
        reloadUPIProviders();
      }
    });

    // 10. Profile View save changes
    elements.btnEditProfile.addEventListener('click', () => {
      elements.profileNameInput.removeAttribute('readonly');
      elements.profilePhoneInput.removeAttribute('readonly');
      elements.profileJobInput.removeAttribute('readonly');
      elements.btnEditProfile.style.display = 'none';
      elements.btnSaveProfile.style.display = 'block';
      createToast('Inputs unlocked. Enter custom profile variables.', 'success');
    });

    elements.btnSaveProfile.addEventListener('click', async () => {
      const name = elements.profileNameInput.value;
      const phone = elements.profilePhoneInput.value;
      const occupation = elements.profileJobInput.value;

      try {
        await apiClient.updateProfile({ name, phone, occupation });
        
        elements.profileNameInput.setAttribute('readonly', 'true');
        elements.profilePhoneInput.setAttribute('readonly', 'true');
        elements.profileJobInput.setAttribute('readonly', 'true');
        elements.btnSaveProfile.style.display = 'none';
        elements.btnEditProfile.style.display = 'block';

        elements.sidebarUserName.textContent = name;
        elements.navGreetingTitle.textContent = `Hello, ${name.split(' ')[0]}`;

        createToast('Personal profile records updated.', 'success');
      } catch (err) {
        createToast(err.message, 'danger');
      }
    });

    // 11. Settings Preferences toggles
    elements.settingsDarkmodeCheckbox.addEventListener('change', (e) => {
      updateSettings('darkMode', e.target.checked);
      toggleTheme(e.target.checked);
      createToast(`Theme styling changed dynamically.`, 'success');
    });

    elements.settingsEmailCheckbox.addEventListener('change', (e) => {
      updateSettings('emailNotifications', e.target.checked);
      createToast(`Email report settings saved.`, 'success');
    });

    elements.settingsSyncCheckbox.addEventListener('change', (e) => {
      updateSettings('autoSyncUPI', e.target.checked);
      createToast(`Automated feeds updates modified.`, 'success');
    });

    elements.settings2faCheckbox.addEventListener('change', (e) => {
      updateSettings('twoFactorAuth', e.target.checked);
      const stateWord = e.target.checked ? 'activated. Verify auth codes upon login.' : 'deactivated.';
      createToast(`Two-Factor Auths ${stateWord}`, 'warning');
    });

    elements.settingsLangSelect.addEventListener('change', (e) => {
      updateSettings('reportingLanguage', e.target.value);
      createToast(`Language settings adjusted.`, 'success');
    });

    elements.btnDeleteProfile.addEventListener('click', () => {
      if (confirm('CAUTION: Are you sure you want to permanently delete all financial records, custom statements, and linked portfolios? This cannot be undone.')) {
        localStorage.clear();
        createToast('User records successfully purged. Returning to portal.', 'danger');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });
  }

  // -----------------------------------------------------------------
  // HELPER UTILITIES
  // -----------------------------------------------------------------

  // Single-page router view swapper
  function switchView(viewName) {
    appState.activeView = viewName;

    // Toggle active link highlights
    elements.navItems.forEach(item => {
      if (item.dataset.view === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Trigger views visibility with fade animation
    elements.views.forEach(v => {
      if (v.id === `view-${viewName}`) {
        v.classList.add('active-view');
      } else {
        v.classList.remove('active-view');
      }
    });

    // Redraw graphs since visibility toggling clears dimensions
    if (viewName === 'dashboard') {
      setTimeout(() => {
        initCharts();
      }, 50);
    } else if (viewName === 'tax') {
      setTimeout(() => {
        initCharts(); // recalculates tax regime comparison bar
      }, 50);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Toggle CSS class themes
  function toggleTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      elements.themeIcon.className = 'fa-solid fa-sun';
    } else {
      document.body.classList.remove('dark-mode');
      elements.themeIcon.className = 'fa-solid fa-moon';
    }

    // Redraw charts grid with correct colors
    setTimeout(() => {
      initCharts();
    }, 150);
  }

  // Save specific settings preference in storage
  function updateSettings(key, val) {
    const s = JSON.parse(localStorage.getItem('fc_settings') || '{}');
    s[key] = val;
    localStorage.setItem('fc_settings', JSON.stringify(s));
    appState.settings = s;
  }

  // Handle uploaded bank statement files
  async function handleFileUpload(file) {
    // Reveal progress loading bars
    elements.uploadProgressContainer.style.display = 'block';
    elements.uploadProgressFill.style.width = '0%';

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      elements.uploadProgressFill.style.width = `${progress}%`;
    }, 150);

    try {
      const result = await apiClient.uploadStatement(file);
      
      // Delay hide progress for UI realism
      setTimeout(() => {
        elements.uploadProgressContainer.style.display = 'none';
        
        // Append preview item card
        const card = document.createElement('div');
        card.className = 'file-preview-card';
        card.innerHTML = `
          <div style="display:flex; align-items:center; gap:10px;">
            <i class="fa-solid fa-file-invoice" style="color:var(--primary); font-size:18px;"></i>
            <div style="display:flex; flex-direction:column;">
              <span style="font-weight:600;">${file.name}</span>
              <span style="font-size:10px; color:var(--text-muted);">${(file.size / 1024).toFixed(1)} KB • Parse Status: Complete</span>
            </div>
          </div>
          <button class="btn-icon-only btn-delete-file-preview" style="color:var(--danger);" title="Remove file"><i class="fa-solid fa-trash-can"></i></button>
        `;
        elements.uploadFilePreviews.appendChild(card);

        createToast(result.message, 'success');
        
        // Trigger dashboard and charts update
        reloadDashboardStats();
        reloadTransactions();
        setTimeout(() => {
          initCharts();
        }, 300);
      }, 1500);

    } catch (err) {
      clearInterval(interval);
      elements.uploadProgressContainer.style.display = 'none';
      createToast('Failed parsing file. Verify integrity.', 'danger');
    }
  }

  // Native Web Crypto API SHA-256 Hashing calculation
  async function computeFileSHA256(file) {
    elements.bcComputedHash.textContent = 'Calculating hash...';
    elements.btnStoreOnBlockchain.disabled = true;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      appState.computedFileHash = hashHex;
      elements.bcComputedHash.textContent = `0x${hashHex}`;
      elements.btnStoreOnBlockchain.disabled = false;
      createToast('SHA-256 calculation complete.', 'success');
    } catch (err) {
      elements.bcComputedHash.textContent = 'Computation Error';
      createToast('Failed to calculate SHA-256 hash.', 'danger');
    }
  }

  // Submit messages into AI chatbot drawer or main frame
  async function submitChatInput(inputEl, msgContainerEl) {
    const text = inputEl.value.trim();
    if (!text) return;

    // Reset input size
    inputEl.value = '';
    inputEl.style.height = 'auto';

    // 1. Add User bubble
    addUserMessage(msgContainerEl, text);

    // 2. Add Typing bubble loader
    const loaderId = addTypingIndicator(msgContainerEl);

    try {
      const response = await apiClient.postChatMessage(text, []);
      removeTypingIndicator(msgContainerEl, loaderId);

      // 3. Add AI Bubble
      addBotMessage(msgContainerEl, response.reply);
      
      // Simulate text-to-speech option if settings language is English
      if (elements.settingsLangSelect.value.startsWith('en')) {
        speakResponseText(response.reply);
      }

    } catch (err) {
      removeTypingIndicator(msgContainerEl, loaderId);
      addBotMessage(msgContainerEl, 'Apologies. FinChain AI cloud endpoint is experiencing timeouts. Please check back shortly.');
    }
  }

  function addUserMessage(container, text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg user-msg';
    msg.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid fa-user"></i></div>
      <div class="msg-bubble-wrapper">
        <div class="msg-bubble">${escapeHTML(text)}</div>
      </div>
    `;
    container.appendChild(msg);
    scrollChatBottom(container);
  }

  function addBotMessage(container, text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg ai-msg';
    const cleanText = formatMarkdownToHTML(text);

    msg.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="msg-bubble-wrapper">
        <div class="msg-bubble">${cleanText}</div>
        <div class="msg-actions">
          <button class="msg-action-btn btn-copy-msg" title="Copy Message"><i class="fa-solid fa-copy"></i> Copy</button>
          <button class="msg-action-btn btn-speak-msg" title="Read Aloud"><i class="fa-solid fa-volume-high"></i> Speak</button>
        </div>
      </div>
    `;

    // Copy listener
    msg.querySelector('.btn-copy-msg').addEventListener('click', () => {
      navigator.clipboard.writeText(text);
      createToast('Message copied.', 'success');
    });

    // Speak listener
    msg.querySelector('.btn-speak-msg').addEventListener('click', () => {
      speakResponseText(text);
    });

    container.appendChild(msg);
    scrollChatBottom(container);
  }

  function addTypingIndicator(container) {
    const id = 'loader_' + Date.now();
    const loader = document.createElement('div');
    loader.className = 'chat-msg ai-msg';
    loader.id = id;
    loader.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="msg-bubble-wrapper">
        <div class="msg-bubble" style="padding: 10px 15px;">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(loader);
    scrollChatBottom(container);
    return id;
  }

  function removeTypingIndicator(container, id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function scrollChatBottom(container) {
    container.scrollTop = container.scrollHeight;
  }

  // Formats bold, codes, linebreaks, and markdown bullets dynamically
  function formatMarkdownToHTML(text) {
    let html = escapeHTML(text);
    // Replace double newlines with breaks
    html = html.replace(/\n\n/g, '<br><br>');
    // Lists bullets
    html = html.replace(/\*\*\s/g, '• ');
    html = html.replace(/\*\s/g, '• ');
    // Bolding
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return html;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Voice synthesis read aloud
  function speakResponseText(text) {
    if ('speechSynthesis' in window) {
      // Cancel ongoing speeches
      window.speechSynthesis.cancel();
      
      // Clean tags from speech
      const speakText = text.replace(/\*\*|\*|#/g, '');
      const utterance = new SpeechSynthesisUtterance(speakText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      
      window.speechSynthesis.speak(utterance);
    }
  }

  // Seed system mock notifications panel
  function renderNotifications() {
    const alerts = [
      { text: 'Tax Optimization algorithm completed. Savings projected.', time: '5m ago', icon: 'fa-chart-pie' },
      { text: 'AWS Cloud statement parsed. Infrastructure costs added.', time: '1h ago', icon: 'fa-cloud-arrow-up' },
      { text: 'UPI link sync for HDFC bank feed verified successfully.', time: '3h ago', icon: 'fa-circle-check' },
      { text: 'SHA256 Hash recorded on Block #19048231', time: '1d ago', icon: 'fa-link' }
    ];

    elements.notificationList.innerHTML = '';
    alerts.forEach(a => {
      const item = document.createElement('div');
      item.className = 'notification-item';
      item.innerHTML = `
        <i class="fa-solid ${a.icon}"></i>
        <div class="notification-item-content">
          <span>${a.text}</span>
          <span class="notification-item-time">${a.time}</span>
        </div>
      `;
      elements.notificationList.appendChild(item);
    });
  }

  // Toast dynamic notification alerts
  function createToast(message, type = 'primary') {
    const id = 'toast_' + Date.now();
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.id = id;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'warning') icon = 'fa-triangle-exclamation';
    if (type === 'danger') icon = 'fa-circle-xmark';

    t.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <div class="toast-content">${message}</div>
    `;

    elements.toastContainer.appendChild(t);

    // Auto clear after 4s
    setTimeout(() => {
      t.style.animation = 'slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse forwards';
      setTimeout(() => {
        t.remove();
      }, 350);
    }, 4000);
  }

  // Simulated download dialog actions
  function simulateDownload(filename, successMsg) {
    createToast('Compiling financial files and encryption streams...', 'primary');
    
    setTimeout(() => {
      const dummyContent = `--- FinChain AI Export ---\nReport Name: ${filename}\nTimestamp: ${new Date().toISOString()}\nVerify Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      
      createToast(successMsg, 'success');
    }, 1500);
  }

  // Value animation logic
  function animateValue(obj, start, end, duration, prefix = '') {
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const val = (progress * (end - start) + start);
      obj.textContent = `${prefix}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Initialize
  initializeApp();
});
