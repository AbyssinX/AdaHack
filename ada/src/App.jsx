import { useState } from "react";
import "./App.css";

function App() {
  const [mode, setMode] = useState(null); // null = hero screen
  const [query, setQuery] = useState("");
  const [personalData, setPersonalData] = useState({
    income: "",
    debt: "",
    invest: "",
    donate: "",
    save: "",
  });

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mode:", mode);
    console.log("Query:", query);
    if (mode === "personal") console.log("Personal Data:", personalData);
  };

  // HERO SECTION
  if (!mode) {
    return (
      <div className="hero">
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

  // MAIN SECTION (with buttons at the top)
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
                  placeholder="Amount to invest"
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
      </main>
    </div>
  );
}

export default App;
