import React, { useState } from "react";
import "./TaxAnalysis.css";
import api from "../api";

export default function TaxAnalysis() {
  const [income, setIncome] = useState(1500000);
  const [deduction80C, setDeduction80C] = useState(150000);
  const [deduction80D, setDeduction80D] = useState(25000);
  const [hra, setHra] = useState(180000);
  const [taxSaved, setTaxSaved] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatINR = (value) =>
    "₹" + Number(value).toLocaleString("en-IN");

  const calculateTax = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/api/tax/calculate", {
        grossIncome: income,
        deduction80C: deduction80C,
        deduction80D: deduction80D,
        hra: hra,
      });

      setTaxSaved(response.data.taxSaved || 0);
      alert(`Estimated Tax Saving: ${formatINR(response.data.taxSaved)}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to calculate tax");
      alert("Error calculating tax. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    alert("PDF generation connected here.");
  };

  return (
    <div className="finchain-app">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">
            ₣
          </div>

          <span>FinChain <b>AI</b></span>
        </div>

        <nav className="sidebar-nav">

          <SidebarItem icon="▦" text="Dashboard" />
          <SidebarItem icon="▤" text="Transactions" />

          <SidebarItem
            icon="◔"
            text="Tax Analysis"
            active
          />

          <SidebarItem icon="▣" text="AI Assistant" />
          <SidebarItem icon="♧" text="AI Insights" />
          <SidebarItem icon="⇧" text="Upload Statement" />
          <SidebarItem icon="⛓" text="Blockchain" />
          <SidebarItem icon="⇩" text="Reports" />
          <SidebarItem icon="♙" text="Profile" />
          <SidebarItem icon="⚙" text="Settings" />

        </nav>

        {/* USER */}
        <div className="sidebar-user">

          <div className="avatar small">
            D
          </div>

          <div className="user-info">
            <strong>Demo</strong>
            <span>demo@finchain.ai</span>
          </div>

          <div className="logout">
            ↪
          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="main-content">

        {/* TOP HEADER */}
        <header className="top-header">

          <div>
            <h1>Tax Analysis</h1>
            <p>Tuesday, August 11, 2026</p>
          </div>

          <div className="profile-avatar">
            D
          </div>

        </header>

        {/* PAGE */}
        <section className="page-content">

          <div className="grid-layout">

            {/* ================= LEFT CARD ================= */}
            <div className="tax-card">

              <div className="card-header">

                <h2>
                  Tax Regime Comparison & Optimizer
                </h2>

                <p>
                  Optimize your tax brackets by modeling
                  Section 80C, 80D and HRA under Indian tax regulations.
                </p>

              </div>

              {/* INCOME */}
              <TaxSlider
                title="Gross Taxable Income"
                value={income}
                setValue={setIncome}
                min={300000}
                max={3000000}
                step={50000}
              />

              {/* 80C */}
              <TaxSlider
                title="Section 80C Deductions (ELSS, PPF, Insurance)"
                value={deduction80C}
                setValue={setDeduction80C}
                min={0}
                max={150000}
                step={5000}
              />

              {/* 80D */}
              <TaxSlider
                title="Section 80D (Health Insurance)"
                value={deduction80D}
                setValue={setDeduction80D}
                min={0}
                max={100000}
                step={5000}
              />

              {/* HRA */}
              <TaxSlider
                title="HRA Exemption"
                value={hra}
                setValue={setHra}
                min={0}
                max={300000}
                step={5000}
              />

              {/* BUTTONS */}
              <div className="action-buttons">

                <button
                  className="calculate-btn"
                  onClick={calculateTax}
                  disabled={loading}
                >
                  <span>▣</span>
                  {loading ? "Calculating..." : "Calculate & Save"}
                </button>

                <button
                  className="pdf-btn"
                  onClick={generatePDF}
                  disabled={loading}
                >
                  <span>▤</span>
                  Generate PDF
                </button>

              </div>

              {error && <div className="error-message">{error}</div>}

            </div>

            {/* ================= RIGHT CARD ================= */}
            <div className="benefits-card">

              <h2>Deductions & Benefits</h2>

              {/* SAVINGS */}
              <div className="saving-box">

                <span className="saving-label">
                  POTENTIAL TAX SAVED
                </span>

                <strong>
                  {formatINR(taxSaved)}
                </strong>

                <p>
                  via New Regime optimization
                </p>

              </div>

              {/* CHART */}
              <div className="chart">

                <div className="chart-y-labels">
                  <span>₹220K</span>
                  <span>₹165K</span>
                  <span>₹110K</span>
                  <span>₹55K</span>
                  <span>₹0K</span>
                </div>

                <div className="chart-area">

                  <div className="grid-line line1"></div>
                  <div className="grid-line line2"></div>
                  <div className="grid-line line3"></div>
                  <div className="grid-line line4"></div>
                  <div className="grid-line line5"></div>

                  <div className="bars">

                    <div className="bar-wrapper">
                      <div
                        className="bar old-bar"
                        style={{ height: "82%" }}
                      ></div>

                      <span>
                        Old Regime
                      </span>
                    </div>

                    <div className="bar-wrapper">
                      <div
                        className="bar new-bar"
                        style={{ height: "51%" }}
                      ></div>

                      <span>
                        New Regime
                      </span>
                    </div>

                  </div>

                </div>

              </div>

              {/* SUGGESTIONS */}
              <div className="suggestions">

                <div className="suggestions-title">
                  OPTIMIZER SUGGESTIONS
                </div>

                {/* SUGGESTION 1 */}
                <div className="suggestion success">

                  <div className="suggestion-icon">
                    ✓
                  </div>

                  <div>
                    <h3>ELSS Investments</h3>

                    <p>
                      Your 80C holds {formatINR(deduction80C)}.
                      Consider maxing out at ₹1,50,000 for full benefit.
                    </p>
                  </div>

                </div>

                {/* SUGGESTION 2 */}
                <div className="suggestion">

                  <div className="suggestion-icon warning">
                    !
                  </div>

                  <div>
                    <h3>Health Insurance (80D)</h3>

                    <p>
                      Claiming {formatINR(deduction80D)}.
                      You can claim up to ₹1,00,000 for family + parents.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =====================================================
   SIDEBAR ITEM
===================================================== */

function SidebarItem({ icon, text, active }) {
  return (
    <div className={`sidebar-item ${active ? "active" : ""}`}>

      <span className="sidebar-icon">
        {icon}
      </span>

      <span>
        {text}
      </span>

    </div>
  );
}


/* =====================================================
   TAX SLIDER
===================================================== */

function TaxSlider({
  title,
  value,
  setValue,
  min,
  max,
  step,
}) {

  const percentage =
    ((value - min) / (max - min)) * 100;

  return (
    <div className="tax-slider">

      <div className="slider-heading">

        <label>
          {title}
        </label>

        <strong>
          ₹{Number(value).toLocaleString("en-IN")}
        </strong>

      </div>

      <div className="range-wrapper">

        <div
          className="range-progress"
          style={{
            width: `${percentage}%`,
          }}
        ></div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) =>
            setValue(Number(e.target.value))
          }
        />

      </div>

    </div>
  );
}
