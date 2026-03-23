import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Safe wrapper for search params so app doesn't crash
 */
function useSafeSearchParams() {
  try {
    return useSearchParams();
  } catch (e) {
    console.warn("Router not available. Falling back to defaults.");
    return [new URLSearchParams(), () => {}];
  }
}

export default function App() {
  const [searchParams, setSearchParams] = useSafeSearchParams();

  // ---- URL PARAMS (with safe defaults)
  const initialDrug = searchParams.get("drug") || "both";
  const initialSection = searchParams.get("section") || "overview";

  // ---- STATE
  const [activeTab, setActiveTab] = useState(initialSection);
  const [selectedDrug, setSelectedDrug] = useState(initialDrug);

  // ---- SYNC STATE → URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedDrug) params.set("drug", selectedDrug);
    if (activeTab) params.set("section", activeTab);

    setSearchParams(params, { replace: true });
  }, [selectedDrug, activeTab, setSearchParams]);

  // ---- HANDLERS
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDrugChange = (drug) => {
    setSelectedDrug(drug);
  };

  // ---- UI (replace with your real components as needed)
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>MOA Visualization</h1>

      {/* Drug Selector */}
      <div style={{ marginBottom: "20px" }}>
        <strong>Select Drug: </strong>
        <button onClick={() => handleDrugChange("both")}>Both</button>
        <button onClick={() => handleDrugChange("drugA")}>Drug A</button>
        <button onClick={() => handleDrugChange("drugB")}>Drug B</button>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: "20px" }}>
        <strong>Section: </strong>
        <button onClick={() => handleTabChange("overview")}>
          Overview
        </button>
        <button onClick={() => handleTabChange("mechanism")}>
          Mechanism
        </button>
        <button onClick={() => handleTabChange("clinical")}>
          Clinical
        </button>
      </div>

      {/* Content */}
      <div style={{ border: "1px solid #ccc", padding: "20px" }}>
        <p>
          <strong>Active Tab:</strong> {activeTab}
        </p>
        <p>
          <strong>Selected Drug:</strong> {selectedDrug}
        </p>
      </div>
    </div>
  );
}
