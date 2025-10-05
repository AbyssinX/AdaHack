import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import "./App.css";

function App() {
  const [mode, setMode] = useState(null);
  const [query, setQuery] = useState("");
  const [personalData, setPersonalData] = useState({
    income: "",
    expenditure: "",
    invest: "",
    donate: "",
    save: "",
    years: "",          // 👈 new field for time input
  });

  const [chartData, setChartData] = useState(null);   // for line chart
  const [barData, setBarData] = useState([]);         // for financial breakdown
  const [showCharts, setShowCharts] = useState(false); // page toggle

  // ------------------- Typing Text for Hero -------------------
  const TYPING_TEXTS = [
    "Why do BOE rates affect mortgages?",
    "What is a Stocks and Shares ISA?",
    "When should I remortgage in the UK?",
    "How to budget with UK taxes effectively?",
    "Where to invest for long-term UK growth?",
  ];

  function TypingText() {
    const [textIndex, setTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [typing, setTyping] = useState(true);

    useEffect(() => {
      const currentText = TYPING_TEXTS[textIndex];
      let timeout;

      if (typing) {
        if (displayedText.length < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayedText(currentText.slice(0, displayedText.length + 1));
          }, 80);
        } else {
          timeout = setTimeout(() => setTyping(false), 2000);
        }
      } else {
        if (displayedText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayedText(currentText.slice(0, displayedText.length - 1));
          }, 50);
        } else {
          setTextIndex((prev) => (prev + 1) % TYPING_TEXTS.length);
          setTyping(true);
        }
      }

      return () => clearTimeout(timeout);
    }, [displayedText, typing, textIndex]);

    return (
      <h2 className="typing-text">
        {displayedText}
        <span className="cursor">|</span>
      </h2>
    );
  }

  // ------------------- Handlers -------------------
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate compound interest data for line chart
  const generateCompoundInterestData = (monthlyInvest) => {
    const P = parseFloat(monthlyInvest);
    if (!P || P <= 0) {
      setChartData(null);
      return;
    }

    const r = 0.08;  // annual interest
    const n = 12;
    const years = 30;
    const data = [];

    for (let t = 1; t <= years; t++) {
      const amount = P * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
      data.push({ year: t, value: Math.round(amount) });
    }

    setChartData(data);
  };

  // Calculate compound interest after t years for bar chart
  const calculateCompoundAfterT = (monthlyInvest, years) => {
    const P = parseFloat(monthlyInvest);
    const T = parseInt(years);
    if (!P || !T || P <= 0 || T <= 0) return 0;

    const r = 0.08;
    const n = 12;
    const amount = P * ((Math.pow(1 + r / n, n * T) - 1) / (r / n));
    return Math.round(amount);
  };

  const handlePersonalAI = (e) => {
    e.preventDefault();

    // Generate line chart for full 30 years
    generateCompoundInterestData(personalData.invest);

    // Compute compound after user-defined time
    const compoundT = calculateCompoundAfterT(
      personalData.invest,
      personalData.years
    );

    // Update financial breakdown
setBarData([
  {
    name: 'Income & Compound',
    income: Number(personalData.income) || 0,
    compound: compoundT
  },
  { name: 'Expenditure', value: Number(personalData.expenditure) || 0 },
  { name: 'Investment', value: Number(personalData.invest) || 0 },
  { name: 'Donation', value: Number(personalData.donate) || 0 },
  { name: 'Savings', value: Number(personalData.save) || 0 }
]);

    setShowCharts(true);
  };

  // ------------------- Screens -------------------

  // HERO
  if (!mode) {
    return (
      <div className="hero">
        <h1>Your Personal Financial Advisor</h1>
        <TypingText />
        <div className="hero-buttons">
          <button className="hero-btn general" onClick={() => setMode("general")}>
            General
          </button>
          <button className="hero-btn personal" onClick={() => setMode("personal")}>
            Personal
          </button>
        </div>
      </div>
    );
  }

  // CHARTS PAGE
  if (showCharts) {
    return (
      <div className="chart-page">
        <h2>Financial Overview</h2>

        {/* Bar Chart */}
        <div className="chart-container">
        <h3>Financial Breakdown</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v) => `£${v.toLocaleString()}`} />
            <Legend />

            {/* stack on first bar */}
            <Bar dataKey="income" stackId="a" fill="#007aff" />
            <Bar dataKey="compound" stackId="a" fill="#00c49f" />

            {/* other categories drawn as single bars */}
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>

        </ResponsiveContainer>
      </div>


        {/* Line Chart */}
        <div className="chart-container">
          <h3>Investment Growth Over 30 Years</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 40, left: 40, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
              <YAxis tickFormatter={(v) => `£${v.toLocaleString()}`} />
              <Tooltip formatter={(v) => `£${v.toLocaleString()}`} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#007aff"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <button className="back-btn" onClick={() => setShowCharts(false)}>
          Back to Form
        </button>
      </div>
    );
  }

  // PERSONAL FORM PAGE
  return (
    <div className="app-container">
      <header className="header">
        <button
          className={mode === "personal" ? "active" : ""}
          onClick={() => setMode("personal")}
        >
          Personal
        </button>
        <button
          className={mode === "general" ? "active" : ""}
          onClick={() => setMode("general")}
        >
          General
        </button>
      </header>

      <main className="main-content">
        <form className="personal-form" onSubmit={handlePersonalAI}>
          <div className="form-sections">
            {/* Inputs on the top-left */}
            <div className="personal-inputs">
              <h2>Personal Info</h2>
              <label>
                Income (£):
                <input
                  type="number"
                  name="income"
                  value={personalData.income}
                  onChange={handlePersonalChange}
                />
              </label>
              <label>
                Expenditure (£):
                <input
                  type="number"
                  name="expenditure"
                  value={personalData.expenditure}
                  onChange={handlePersonalChange}
                />
              </label>
              <label>
                Investment (£/month):
                <input
                  type="number"
                  name="invest"
                  value={personalData.invest}
                  onChange={handlePersonalChange}
                />
              </label>
              <label>
                Time (years):
                <input
                  type="number"
                  name="years"
                  placeholder="e.g., 5"
                  value={personalData.years}
                  onChange={handlePersonalChange}
                />
              </label>
              <label>
                Donation (£):
                <input
                  type="number"
                  name="donate"
                  value={personalData.donate}
                  onChange={handlePersonalChange}
                />
              </label>
              <label>
                Savings (£/month):
                <input
                  type="number"
                  name="save"
                  value={personalData.save}
                  onChange={handlePersonalChange}
                />
              </label>
            </div>

            {/* AI Chatbox */}
            <div className="ai-chatbox">
              <h2>Ask AI Advisor</h2>
              <input
                type="text"
                placeholder="Ask a finance question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="submit-ai-btn">
            Submit & View Charts
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
