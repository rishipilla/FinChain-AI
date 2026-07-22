# FinChain-AI
Blockchain-Powered Smart Financial &amp; Tax Intelligence Platform
[README.md](https://github.com/user-attachments/files/30280744/README.1.md)
# FinChain AI

AI-powered personal finance and tax dashboard with blockchain-verified reports — built for [Hackathon Name].

FinChain AI helps users understand their spending, estimate and simulate their taxes, and get a tamper-proof, verifiable record of their financial reports.

---

## ✨ What It Does (Hackathon Demo Scope)

- 🔐 User signup/login (JWT-based auth)
- 📄 Upload a bank statement (PDF) → transactions extracted via OCR
- 📊 Dashboard with income, expenses, and category-wise spending charts
- 🤖 AI-generated spending insights and savings suggestions
- 🧮 Live tax estimator (old vs. new regime)
- 🎛️ Tax simulator — adjust ELSS/PPF/NPS/insurance and see tax update instantly
- 📁 Downloadable PDF financial report
- ⛓️ Report hash stored on-chain (testnet) for tamper-proof verification
- 💬 Simple AI chatbot for basic finance/tax questions

> Full long-term vision (UPI integration, ITR auto-filing, fraud detection, credit score analysis, admin dashboard, etc.) is listed under [Future Roadmap](#-future-roadmap).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | Firebase / Auth0, JWT |
| OCR | Tesseract / Google Vision API |
| AI | Gemini API / OpenAI API |
| Charts | Chart.js / Recharts |
| Blockchain | Solidity, Polygon (testnet), IPFS |
| Reports | PDFKit / jsPDF |
| File Storage | Firebase Storage / Cloudinary |

---

## 📁 Project Structure

```
finchain-ai/
├── frontend/           # React app (Kruthi & Ananya)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
├── backend/            # Node + Express API (Rishi)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/       # OCR, AI, tax calc, PDF generation
│   └── server.js
├── blockchain/         # Solidity contracts + scripts (Manogya)
│   ├── contracts/
│   ├── scripts/
│   └── hardhat.config.js
├── docs/                # Pitch deck, diagrams, demo script (Zunairah)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- MetaMask wallet + testnet funds (Polygon Amoy faucet)
- API keys: Gemini/OpenAI, Firebase/Auth0, Google Vision (if used)

### 1. Clone the repo
```bash
git clone https://github.com/<org>/finchain-ai.git
cd finchain-ai
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env   # fill in MongoDB URI, JWT secret, AI API key, etc.
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Blockchain setup
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network amoy
```
Copy the deployed contract address into `backend/.env` as `CONTRACT_ADDRESS`.

---

## 🔑 Environment Variables

Create a `.env` file in `backend/` with:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_gemini_or_openai_key
CONTRACT_ADDRESS=your_deployed_contract_address
RPC_URL=your_polygon_amoy_rpc_url
PRIVATE_KEY=your_wallet_private_key   # testnet wallet only, never mainnet funds
```

---

## 👥 Team & Roles

| Name | Role |
|---|---|
| Rishi | Backend — auth, APIs, OCR, tax logic, AI integration, PDF/hash generation |
| Manogya | Blockchain — smart contract, testnet deployment, hash storage/verification |
| Kruthi | Frontend — login/signup, upload flow, dashboard & charts |
| Ananya | Frontend — tax estimator, simulator, chatbot UI, report download |
| Zunairah | Presentation — pitch deck, demo script, visuals |

---

## 🗺️ Future Roadmap

- Direct bank account & UPI integration (Account Aggregator API)
- Automated ITR filing
- Fraud detection (unusual transactions, duplicate payments)
- Voice assistant for tax queries
- Credit score analysis & mutual fund recommendations
- GST support & CA consultation
- Family finance dashboard
- Admin analytics dashboard

---

## 📄 License

Built for hackathon/demo purposes. Not production-ready — do not use with real financial data or real funds.
