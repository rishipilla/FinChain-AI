/**
 * FinChain AI - Unified API Client & State Manager
 * 
 * Communicates with the Node.js backend if available, otherwise falls back
 * to a full-fidelity mock system using localStorage.
 */

const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('finchain_jwt') || null;
    this.isOfflineMode = false;
    this.initializeMockData();
  }

  // Set offline/local mock status and emit an event
  setOfflineMode(status) {
    if (this.isOfflineMode !== status) {
      this.isOfflineMode = status;
      window.dispatchEvent(new CustomEvent('api-status-changed', { detail: { offline: status } }));
    }
  }

  // Get authorization headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Wrapper for fetch requests with automatic server fallback
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    options.headers = { ...this.getHeaders(), ...options.headers };

    try {
      if (this.isOfflineMode) {
        throw new Error('Running in Mock Offline Mode');
      }

      const response = await fetch(url, options);
      
      // If unauthorized, clear token
      if (response.status === 401) {
        this.logout();
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      this.setOfflineMode(false);
      return await response.json();
    } catch (error) {
      console.warn(`API Request to ${endpoint} failed. Defaulting to local mockup database.`, error.message);
      this.setOfflineMode(true);
      return this.handleMockFallback(endpoint, options);
    }
  }

  // Auth Operations
  async register(username, email, password) {
    try {
      const result = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
      });
      if (result.token) {
        this.setToken(result.token);
      }
      return result;
    } catch (e) {
      // Local register fallback
      const users = JSON.parse(localStorage.getItem('fc_users') || '[]');
      if (users.find(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }
      const newUser = { username, email, password, id: 'usr_' + Date.now() };
      users.push(newUser);
      localStorage.setItem('fc_users', JSON.stringify(users));

      // Generate a mock JWT
      const mockToken = 'mock_jwt_token_' + btoa(JSON.stringify(newUser));
      this.setToken(mockToken);
      localStorage.setItem('fc_current_user', JSON.stringify({ username, email }));
      
      return { success: true, token: mockToken, user: { username, email }, message: 'Registered successfully (Local Mode)' };
    }
  }

  async login(email, password) {
    try {
      const result = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (result.token) {
        this.setToken(result.token);
      }
      return result;
    } catch (e) {
      // Local login fallback
      const users = JSON.parse(localStorage.getItem('fc_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      // Default demo login if no registered users match
      if (email === 'demo@finchain.ai' && password === 'password123') {
        const demoUser = { username: 'Alex Mercer', email: 'demo@finchain.ai' };
        const mockToken = 'mock_jwt_token_demo';
        this.setToken(mockToken);
        localStorage.setItem('fc_current_user', JSON.stringify(demoUser));
        return { success: true, token: mockToken, user: demoUser, message: 'Logged in successfully (Demo User)' };
      }

      if (!user) {
        throw new Error('Invalid email or password credentials');
      }

      const mockToken = 'mock_jwt_token_' + btoa(JSON.stringify(user));
      this.setToken(mockToken);
      localStorage.setItem('fc_current_user', JSON.stringify({ username: user.username, email: user.email }));
      return { success: true, token: mockToken, user: { username: user.username, email: user.email }, message: 'Logged in successfully (Local Mode)' };
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('finchain_jwt');
    localStorage.removeItem('fc_current_user');
    window.dispatchEvent(new CustomEvent('auth-status-changed', { detail: { loggedIn: false } }));
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('finchain_jwt', token);
    window.dispatchEvent(new CustomEvent('auth-status-changed', { detail: { loggedIn: true } }));
  }

  isLoggedIn() {
    return this.token !== null;
  }

  // Dashboard Data Fetching
  async getDashboardData() {
    return this.request('/dashboard', { method: 'GET' });
  }

  // File Upload
  async uploadStatement(file) {
    const formData = new FormData();
    formData.append('statement', file);
    
    // Custom handling to bypass request()'s content-type header override
    try {
      if (this.isOfflineMode) throw new Error('Offline Mode');
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });
      if (!response.ok) throw new Error();
      return await response.json();
    } catch (error) {
      console.warn('Upload API failed, simulating local parse.');
      return new Promise((resolve) => {
        setTimeout(() => {
          // Add standard transactions and update local db to simulate parsing a bank statement
          const currentDashboard = JSON.parse(localStorage.getItem('fc_dashboard_data'));
          
          // Generate a few mockup transactions
          const newTransactions = [
            { id: 'tx_' + Date.now() + '_1', date: new Date().toISOString().split('T')[0], merchant: 'Amazon Web Services', category: 'Infrastructure', amount: 1540.00, mode: 'Credit Card', status: 'Success' },
            { id: 'tx_' + Date.now() + '_2', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], merchant: 'Google Workspace', category: 'Software / SaaS', amount: 78.50, mode: 'Auto-Debit', status: 'Success' },
            { id: 'tx_' + Date.now() + '_3', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], merchant: 'Uber Business', category: 'Travel & Commute', amount: 145.20, mode: 'UPI', status: 'Success' },
            { id: 'tx_' + Date.now() + '_4', date: new Date(Date.now() - 259200000).toISOString().split('T')[0], merchant: 'Starbucks Coffee', category: 'Food & Marketing', amount: 32.80, mode: 'UPI', status: 'Success' }
          ];

          // Save new transactions
          const dbTransactions = JSON.parse(localStorage.getItem('fc_transactions') || '[]');
          localStorage.setItem('fc_transactions', JSON.stringify([...newTransactions, ...dbTransactions]));

          // Adjust dashboard income/savings
          currentDashboard.totalExpense += 1796.50;
          currentDashboard.totalSavings = currentDashboard.totalIncome - currentDashboard.totalExpense;
          currentDashboard.healthScore = Math.max(50, currentDashboard.healthScore - 2);
          localStorage.setItem('fc_dashboard_data', JSON.stringify(currentDashboard));

          resolve({
            success: true,
            message: 'Statement parsed successfully. 4 new transactions recorded.',
            summary: {
              parsedTransactions: 4,
              totalValue: 1796.50,
              fileName: file.name
            }
          });
        }, 1500); // realistic delay
      });
    }
  }

  // Reports
  async getReports() {
    return this.request('/reports', { method: 'GET' });
  }

  // AI Chat
  async postChatMessage(message, history = []) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history })
    });
  }

  // Profile get & update
  async getProfile() {
    return this.request('/profile', { method: 'GET' });
  }

  async updateProfile(profileData) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Tax details
  async getTaxInfo() {
    return this.request('/tax', { method: 'GET' });
  }

  // Store Blockchain Hash
  async storeBlockchainHash(data) {
    return this.request('/blockchain/storeHash', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // -----------------------------------------------------------------
  // MOCK SYSTEM INITIALIZER & HANDLERS
  // -----------------------------------------------------------------
  initializeMockData() {
    // Initial profile
    if (!localStorage.getItem('fc_profile')) {
      const defaultProfile = {
        name: 'Alex Mercer',
        email: 'demo@finchain.ai',
        phone: '+1 (555) 019-2834',
        pan: 'ABCDE1234F',
        aadhaar: '•••• •••• 9812',
        occupation: 'Senior Software Architect',
        taxStatus: 'Resident Individual',
        badge: 'Premium Investor',
        linkedAccounts: 3
      };
      localStorage.setItem('fc_profile', JSON.stringify(defaultProfile));
    }

    // Initial Dashboard Data
    if (!localStorage.getItem('fc_dashboard_data')) {
      const defaultDashboard = {
        totalIncome: 125000.00,
        totalExpense: 48250.00,
        totalSavings: 76750.00,
        estimatedTax: 18200.00,
        healthScore: 84,
        blockchainStatus: 'Synchronized',
        recentUploads: [
          { name: 'Q2_Bank_Statement.pdf', date: '2026-07-20', status: 'Success' },
          { name: 'Salary_Slip_June.pdf', date: '2026-07-02', status: 'Success' }
        ],
        monthlySpending: [4100, 4800, 3900, 5200, 4300, 4825],
        monthlyIncome: [10000, 10000, 10000, 10000, 10000, 10500],
        expenseCategories: {
          'Infrastructure': 12000,
          'Software / SaaS': 9400,
          'Office & Operations': 8500,
          'Travel & Commute': 6200,
          'Food & Marketing': 5800,
          'Legal & Compliance': 6350
        }
      };
      localStorage.setItem('fc_dashboard_data', JSON.stringify(defaultDashboard));
    }

    // Initial Transactions
    if (!localStorage.getItem('fc_transactions')) {
      const defaultTransactions = [
        { id: 'tx_1', date: '2026-07-24', merchant: 'Stripe Subscription', category: 'Software / SaaS', amount: 499.00, mode: 'Credit Card', status: 'Success' },
        { id: 'tx_2', date: '2026-07-22', merchant: 'AWS EMEA Cloud', category: 'Infrastructure', amount: 2450.00, mode: 'Auto-Debit', status: 'Success' },
        { id: 'tx_3', date: '2026-07-21', merchant: 'WeWork Office Rent', category: 'Office & Operations', amount: 3200.00, mode: 'Bank Transfer', status: 'Success' },
        { id: 'tx_4', date: '2026-07-19', merchant: 'Vercel Pro Deploy', category: 'Software / SaaS', amount: 20.00, mode: 'Credit Card', status: 'Success' },
        { id: 'tx_5', date: '2026-07-18', merchant: 'Uber rides', category: 'Travel & Commute', amount: 84.50, mode: 'UPI', status: 'Success' },
        { id: 'tx_6', date: '2026-07-15', merchant: 'Github Enterprise', category: 'Software / SaaS', amount: 250.00, mode: 'Credit Card', status: 'Success' },
        { id: 'tx_7', date: '2026-07-14', merchant: 'Slack Technologies', category: 'Software / SaaS', amount: 180.00, mode: 'Credit Card', status: 'Success' },
        { id: 'tx_8', date: '2026-07-12', merchant: 'Adobe Creative Suite', category: 'Software / SaaS', amount: 82.99, mode: 'Auto-Debit', status: 'Success' },
        { id: 'tx_9', date: '2026-07-10', merchant: 'Starbucks Coffee', category: 'Food & Marketing', amount: 15.40, mode: 'UPI', status: 'Success' },
        { id: 'tx_10', date: '2026-07-08', merchant: 'Google Ads campaigns', category: 'Food & Marketing', amount: 1200.00, mode: 'Credit Card', status: 'Success' }
      ];
      localStorage.setItem('fc_transactions', JSON.stringify(defaultTransactions));
    }

    // Initial Blockchain Logs
    if (!localStorage.getItem('fc_blockchain_ledger')) {
      const defaultLedger = [
        { txId: 'TXN-9021832', timestamp: '2026-07-24 14:32:05', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', status: 'Verified', blockNumber: '19048231' },
        { txId: 'TXN-8742918', timestamp: '2026-07-20 09:15:42', hash: '8f4f3c7e923e1f0e4b859e2f495b4c107293a5ef52427210e74f32e92c235b81', status: 'Verified', blockNumber: '19034298' }
      ];
      localStorage.setItem('fc_blockchain_ledger', JSON.stringify(defaultLedger));
    }

    // Initial settings
    if (!localStorage.getItem('fc_settings')) {
      const defaultSettings = {
        darkMode: true,
        emailNotifications: true,
        pushNotifications: false,
        twoFactorAuth: false,
        autoSyncUPI: true,
        reportingLanguage: 'en'
      };
      localStorage.setItem('fc_settings', JSON.stringify(defaultSettings));
    }

    // Initial UPI Accounts
    if (!localStorage.getItem('fc_upi_accounts')) {
      const defaultUPI = [
        { id: 'bank_1', bankName: 'HDFC Bank', accNo: '•••• •••• 5421', upiId: 'alexmercer@okhdfcbank', connected: true, app: 'Google Pay' },
        { id: 'bank_2', bankName: 'ICICI Bank', accNo: '•••• •••• 9942', upiId: 'mercer.alex@okicici', connected: true, app: 'PhonePe' },
        { id: 'bank_3', bankName: 'State Bank of India', accNo: '•••• •••• 3001', upiId: 'alex89@paytm', connected: false, app: 'Paytm' }
      ];
      localStorage.setItem('fc_upi_accounts', JSON.stringify(defaultUPI));
    }
  }

  // Handle local mock API fallbacks
  handleMockFallback(endpoint, options) {
    const method = options.method || 'GET';

    if (endpoint === '/dashboard' && method === 'GET') {
      return JSON.parse(localStorage.getItem('fc_dashboard_data'));
    }

    if (endpoint === '/reports' && method === 'GET') {
      return {
        reports: [
          { id: 'rep_1', title: 'Q2 Comprehensive Financial Report', type: 'PDF', date: '2026-07-20', size: '2.4 MB' },
          { id: 'rep_2', title: 'FY2025-26 Tax Regime Analysis', type: 'PDF', date: '2026-07-15', size: '1.8 MB' },
          { id: 'rep_3', title: 'Ledger Audit Transaction History', type: 'CSV', date: '2026-07-24', size: '540 KB' },
          { id: 'rep_4', title: 'SHA256 Blockchain Verification Certificate', type: 'PDF', date: '2026-07-24', size: '120 KB' }
        ]
      };
    }

    if (endpoint === '/chat' && method === 'POST') {
      const body = JSON.parse(options.body);
      const query = body.message.toLowerCase();
      let reply = "I'm processing your request. As FinChain AI, I can help analyze your statements, estimate your taxes under old vs new regimes, and pinpoint savings. Could you please specify your question details?";

      if (query.includes('analyze') || query.includes('statement')) {
        reply = "I've reviewed your uploaded bank statement for July. Your **highest expenditure** was towards **Infrastructure** ($2,450.00 to AWS EMEA). You also had minor subscriptions like Stripe ($499) and Vercel ($20). Your recurring savings stand at **61.4%**, which is excellent and puts your Financial Health Score at a high **84/100**.";
      } else if (query.includes('tax') || query.includes('estimate')) {
        reply = "Based on your taxable income of **$125,000**, your estimated tax is **$18,200** under the New Tax Regime. In comparison, the Old Tax Regime estimates **$21,450** without deductions. By claiming standard Section 80C ($150,000 INR equivalent) and 80D ($50,000 INR equivalent), you could lower your Old Regime tax to **$17,100**, saving you **$1,100** more than the New Regime. I recommend reviewing your Section 80C investments.";
      } else if (query.includes('save') || query.includes('80c') || query.includes('investment')) {
        reply = "Under Section 80C, you can deduct up to ₹1,50,000 ($1,800 USD approx) annually. I suggest looking into:\n\n1. **Equity Linked Savings Schemes (ELSS)**: 3-year lock-in with historical returns of 12-15%.\n2. **Public Provident Fund (PPF)**: Risk-free government-backed scheme with 7.1% interest.\n3. **National Pension System (NPS)**: Additional deduction of ₹50,000 under Section 80CCD(1B).\n\nLet me know if you would like me to project ELSS returns for you!";
      } else if (query.includes('expense') || query.includes('highest')) {
        reply = "Your top expense categories this month are:\n\n* **Infrastructure**: $14,450 (AWS Cloud & hosting upgrades)\n* **Office Space**: $3,200 (WeWork office rents)\n* **Software & Subscriptions**: $990 (Stripe, GitHub, Adobe, Slack)\n\nAWS represents **50.7%** of your total expenses. I advise looking into AWS Reserved Instances or Savings Plans to trim these cloud bills by up to 30%.";
      } else if (query.includes('predict') || query.includes('next month')) {
        reply = "Predictive modeling suggests your spending for next month will sit around **$46,500** (a 3.6% decrease). We expect software subscriptions to stay flat at ~$1,000, while AWS infrastructure bills might fall slightly after cleanups of unused dev environments.";
      } else if (query.includes('unusual') || query.includes('suspicious')) {
        reply = "I ran an anomaly detection sweep on your transactions. **No major suspicious activities detected.** However, we flagged a recurring **$82.99** charge from Adobe Creative Suite. If this software is unused, cancelling it could save you **$995.88** annually.";
      } else if (query.includes('blockchain')) {
        reply = "FinChain AI secures your audits using SHA-256 state hashes recorded on-chain. Current block height is **19,048,231**. Your latest ledger state hash is `e3b0c442...b855`. This mathematically proves that your transactions have not been tampered with or modified post-upload.";
      }

      return {
        reply,
        timestamp: new Date().toISOString(),
        id: 'msg_' + Date.now()
      };
    }

    if (endpoint === '/profile' && method === 'GET') {
      return JSON.parse(localStorage.getItem('fc_profile'));
    }

    if (endpoint === '/profile' && method === 'PUT') {
      const data = JSON.parse(options.body);
      const current = JSON.parse(localStorage.getItem('fc_profile'));
      const updated = { ...current, ...data };
      localStorage.setItem('fc_profile', JSON.stringify(updated));
      return { success: true, profile: updated, message: 'Profile updated in local storage' };
    }

    if (endpoint === '/tax' && method === 'GET') {
      return {
        estimatedTax: 18200,
        oldRegimeTotal: 21450,
        newRegimeTotal: 18200,
        deductionsApplied: {
          sec80c: 120000,
          sec80d: 35000
        },
        recommendations: [
          'Invest an additional $30,000 INR in ELSS/PPF to max out Section 80C and save an extra $900 in tax.',
          'Consider corporate health insurance policies under Section 80D to offset taxable income further.'
        ]
      };
    }

    if (endpoint === '/blockchain/storeHash' && method === 'POST') {
      const data = JSON.parse(options.body);
      const ledger = JSON.parse(localStorage.getItem('fc_blockchain_ledger') || '[]');
      
      const newEntry = {
        txId: 'TXN-' + Math.floor(1000000 + Math.random() * 9000000),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        hash: data.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        status: 'Verified',
        blockNumber: String(19048232 + ledger.length)
      };

      ledger.unshift(newEntry);
      localStorage.setItem('fc_blockchain_ledger', JSON.stringify(ledger));

      // Update dashboard status
      const dash = JSON.parse(localStorage.getItem('fc_dashboard_data'));
      dash.blockchainStatus = 'Verified';
      localStorage.setItem('fc_dashboard_data', JSON.stringify(dash));

      return { success: true, entry: newEntry, message: 'SHA256 Hash stored and verified on-chain.' };
    }

    throw new Error(`Unsupported offline mock handler for ${endpoint}`);
  }
}

// Export singleton instance
const api = new ApiClient();
window.apiClient = api;
