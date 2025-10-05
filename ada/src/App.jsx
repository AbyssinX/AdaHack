import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [mode, setMode] = useState(null);
  const [query, setQuery] = useState("");
  const [personalData, setPersonalData] = useState({
    income: "",
    debt: "",
    invest: "",
    donate: "",
    save: "",
  });
  const [chartData, setChartData] = useState(null);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mode:", mode);
    console.log("Query:", query);
    if (mode === "personal") {
      console.log("Personal Data:", personalData);
      generateCompoundInterestData(personalData.invest);
    }
  };

  const generateCompoundInterestData = (monthlyInvest) => {
    const P = parseFloat(monthlyInvest);
    if (!P || P <= 0) {
      setChartData(null);
      return;
    }

    const r = 0.08; // 8% annual interest
    const n = 12; // compounding monthly
    const years = 30; // show 30 years of growth
    const data = [];

    for (let t = 1; t <= years; t++) {
      const amount = P * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
      data.push({ year: t, value: Math.round(amount) });
    }

    setChartData(data);
  };

  // HERO SECTION
  if (!mode) {
    return (
      <div className="hero no-scroll">
        <h1>Your Personal Financial Advisor</h1>
        <div className="hero-buttons">
          <button
            className="hero-btn general"
            onClick={() => setMode("general")}
          >
            General
          </button>
          <button
            className="hero-btn personal"
            onClick={() => setMode("personal")}
          >
            Personal
          </button>
        </div>
      </div>
    );
  }

  // MAIN SECTION
  return (
    <div className="app-container">
      <header className="header">
        <button
          className={mode === "personal" ? "active" : ""}
          onClick={() => {
            setMode("personal");
            setChartData(null);
          }}
        >
          Personal
        </button>
        <button
          className={mode === "general" ? "active" : ""}
          onClick={() => {
            setMode("general");
            setChartData(null);
          }}
        >
          General
        </button>
      </header>

      <main className="main-content">
        {!chartData ? (
          <form className="search-form" onSubmit={handleSubmit}>
            <h2>
              {mode === "personal"
                ? "Personal Finance Assistant"
                : "General Finance Assistant"}
            </h2>

            <input
              type="text"
              placeholder={`Ask a ${mode} finance question...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {mode === "personal" && (
              <div className="personal-fields">
                <label>
                  Income:
                  <input
                    type="number"
                    name="income"
                    placeholder="Your monthly income"
                    value={personalData.income}
                    onChange={handlePersonalChange}
                  />
                </label>
                <label>
                  Debt:
                  <input
                    type="number"
                    name="debt"
                    placeholder="Your total debt"
                    value={personalData.debt}
                    onChange={handlePersonalChange}
                  />
                </label>
                <label>
                  Amount to Invest:
                  <input
                    type="number"
                    name="invest"
                    placeholder="Amount to invest monthly"
                    value={personalData.invest}
                    onChange={handlePersonalChange}
                  />
                </label>
                <label>
                  Amount to Donate:
                  <input
                    type="number"
                    name="donate"
                    placeholder="Amount to donate"
                    value={personalData.donate}
                    onChange={handlePersonalChange}
                  />
                </label>
                <label>
                  Monthly Savings:
                  <input
                    type="number"
                    name="save"
                    placeholder="Amount saved monthly"
                    value={personalData.save}
                    onChange={handlePersonalChange}
                  />
                </label>
              </div>
            )}

            <button type="submit">Submit</button>
          </form>
        ) : (
          <div className="chart-container">
            <h2>Compound Interest Growth (8% Annual Return)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{
                    value: "Years",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#007aff"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <button className="back-btn" onClick={() => setChartData(null)}>
              Back to Form
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
