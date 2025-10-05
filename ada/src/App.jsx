import { useState, useEffect } from "react";
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
    expenditure: "",
    invest: "",
    donate: "",
    save: "",
  });
  const [chartData, setChartData] = useState(null);

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
        // Typing characters one by one
        if (displayedText.length < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayedText(currentText.slice(0, displayedText.length + 1));
          }, 80); // typing speed
        } else {
          // Pause before deleting
          timeout = setTimeout(() => setTyping(false), 2000);
        }
      } else {
        // Deleting characters one by one
        if (displayedText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayedText(currentText.slice(0, displayedText.length - 1));
          }, 50); // deleting speed
        } else {
          // Move to next text
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

  // for general ai
  const handleGeneralAI = (e) => {
    e.preventDefault();
    if (query.trim()) {
      alert(`General AI response for: ${query}`);
      // Later: replace with actual AI API call
    }
  };

  // Handle input change for personal data
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate compound interest data
  const generateCompoundInterestData = (monthlyInvest) => {
    const P = parseFloat(monthlyInvest);
    if (!P || P <= 0) {
      setChartData(null);
      return;
    }

    const r = 0.08; // 8% annual
    const n = 12; // monthly
    const years = 30;
    const data = [];

    for (let t = 1; t <= years; t++) {
      const amount = P * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
      data.push({ year: t, value: Math.round(amount) });
    }

    setChartData(data);
  };

  // Unified handler for personal form + AI query
  const handlePersonalAI = (e) => {
    e.preventDefault();
    generateCompoundInterestData(personalData.invest);

    if (query.trim()) {
      alert(`AI response for: ${query}`);
      // replace with actual AI call
    }
  };

  // HERO SCREEN
  if (!mode) {
    return (
      <div className="hero no-scroll">
        <h1>Your Personal Financial Advisor</h1>
        <TypingText />
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
          mode === "personal" ? (
            <form className="personal-form" onSubmit={handlePersonalAI}>
              <div className="form-sections">
                {/* LEFT – Personal inputs */}
                <div className="personal-inputs">
                  <h2>Personal Financial Info</h2>
                  <label>
                    Income (£):
                    <input
                      type="number"
                      name="income"
                      placeholder="Your monthly income"
                      value={personalData.income}
                      onChange={handlePersonalChange}
                    />
                  </label>
                  <label>
                    Monthly Expenditure (£):
                    <input
                      type="number"
                      name="expenditure"
                      placeholder="Your monthly expenditure"
                      value={personalData.expenditure}
                      onChange={handlePersonalChange}
                    />
                  </label>
                  <label>
                    Amount to Invest (£/month):
                    <input
                      type="number"
                      name="invest"
                      placeholder="Amount to invest monthly"
                      value={personalData.invest}
                      onChange={handlePersonalChange}
                    />
                  </label>
                  <label>
                    Amount to Donate (£):
                    <input
                      type="number"
                      name="donate"
                      placeholder="Amount to donate"
                      value={personalData.donate}
                      onChange={handlePersonalChange}
                    />
                  </label>
                  <label>
                    Monthly Savings (£):
                    <input
                      type="number"
                      name="save"
                      placeholder="Amount saved monthly"
                      value={personalData.save}
                      onChange={handlePersonalChange}
                    />
                  </label>
                </div>

                {/* RIGHT – AI chatbox */}
                <div className="ai-chatbox">
                  <h2>Ask Your AI Advisor</h2>
                  <input
                    type="text"
                    placeholder="Ask a finance question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Unified button */}
              <button type="submit" className="submit-ai-btn">
                Submit & Ask AI
              </button>
            </form>
          ) : (
            <form
              className="personal-form"
              onSubmit={(e) => handleGeneralAI(e)}
            >
              <div className="form-sections">
                <div
                  className="ai-chatbox"
                  style={{ flex: 1, borderLeft: "none", paddingLeft: 0 }}
                >
                  <h2>Ask Your AI Advisor</h2>
                  <input
                    type="text"
                    placeholder="Ask a general finance question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="submit-ai-btn">
                Ask AI
              </button>
            </form>
          )
        ) : (
          <div className="chart-container">
            <h2>Compound Interest Growth (8% Annual Return)</h2>
            <ResponsiveContainer width="100%" height={420}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 40, left: 60, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{
                    value: "Years",
                    position: "insideBottom",
                    offset: -5,
                  }}
                  tick={{ fontSize: 12 }}
                  interval={4}
                  minTickGap={10}
                />
                <YAxis
                  tickFormatter={(v) => `£${v.toLocaleString()}`}
                  tick={{ fontSize: 12 }}
                  width={100}
                  tickMargin={10}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  formatter={(v) => `£${v.toLocaleString()}`}
                  labelFormatter={(l) => `Year ${l}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#007aff"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
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
