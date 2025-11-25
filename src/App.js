// src/App.js
import React, { useState } from "react";
import subjects from "./subjects";
import GradeInput from "./GradeInput";
import InternalCalculator from "./InternalCalculator";
import "./App.css";

const PREVIOUS_TOTAL_CREDITS = 81; // <-- SET YOUR REAL COMPLETED CREDITS

export default function App() {
  const [activeTab, setActiveTab] = useState("sgpa");

  const [grades, setGrades] = useState(
    subjects.reduce((acc, _, idx) => {
      acc[idx] = "";
      return acc;
    }, {})
  );

  const [prevCgpa, setPrevCgpa] = useState("");

  const [sgpa, setSgpa] = useState(null);
  const [expectedCgpa, setExpectedCgpa] = useState(null);

  const currentSemCredits = subjects.reduce(
    (sum, s) => sum + Number(s.credits),
    0
  );

  const handleGradeChange = (index, grade) => {
    setGrades((prev) => ({ ...prev, [index]: grade }));
  };

  const calculate = () => {
    let weightedSum = 0;

    subjects.forEach((subj, idx) => {
      let gp = parseFloat(grades[idx]);
      if (isNaN(gp)) gp = 0;
      if (gp < 0) gp = 0;
      if (gp > 10) gp = 10;

      weightedSum += gp * subj.credits;
    });

    const semSgpa =
      currentSemCredits === 0 ? 0 : weightedSum / currentSemCredits;

    const prevCG = parseFloat(prevCgpa);
    const prevCrd = PREVIOUS_TOTAL_CREDITS;

    let newCgpa = null;
    if (!isNaN(prevCG) && prevCG >= 0 && prevCG <= 10 && prevCrd > 0) {
      newCgpa =
        (prevCG * prevCrd + semSgpa * currentSemCredits) /
        (prevCrd + currentSemCredits);
    }

    setSgpa(semSgpa);
    setExpectedCgpa(newCgpa);
  };

  return (
    <div className="app">

      {/* ========== TOP NAVIGATION TABS ========== */}
      <div className="top-tabs">
        <button
          className={activeTab === "sgpa" ? "top-tab active" : "top-tab"}
          onClick={() => setActiveTab("sgpa")}
        >
          SGPA / CGPA Calculator
        </button>

        <button
          className={activeTab === "internal" ? "top-tab active" : "top-tab"}
          onClick={() => setActiveTab("internal")}
        >
          Internal Marks Calculator
        </button>
      </div>

      {/* ========== TAB CONTENT ========== */}
      {activeTab === "sgpa" && (
        <>
          <h1>SGPA & Expected CGPA Calculator (R23)</h1>

          <section className="card">
            <h2>This Semester Subjects</h2>
            <p>
              Credits this semester: <strong>{currentSemCredits}</strong>
            </p>

            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Code</th>
                  <th>Course Title</th>
                  <th>Credits</th>
                  <th>Grade Point (0–10)</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subj, idx) => (
                  <tr key={subj.code}>
                    <td>{idx + 1}</td>
                    <td>{subj.code}</td>
                    <td className="subject-name">{subj.name}</td>
                    <td>{subj.credits}</td>
                    <td>
                      <input
                        className="grade-input"
                        type="number"
                        min="0"
                        max="10"
                        step="0.01"
                        value={grades[idx]}
                        onChange={(e) => handleGradeChange(idx, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="card">
            <h2>Previous CGPA</h2>
            <p className="note">
              You have already completed <strong>{PREVIOUS_TOTAL_CREDITS}</strong>{" "}
              credits before this semester.
            </p>
            <div className="input-group">
              <label>Enter your previous overall CGPA</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={prevCgpa}
                onChange={(e) => setPrevCgpa(e.target.value)}
                placeholder="e.g., 8.25"
              />
            </div>
          </section>

          <button className="calculate-btn" onClick={calculate}>
            Calculate SGPA & Expected CGPA
          </button>

          <section className="card results">
            <h2>Results</h2>
            <p>
              <strong>SGPA this semester:</strong>{" "}
              {sgpa !== null ? sgpa.toFixed(2) : "--"}
            </p>
            <p>
              <strong>Old CGPA:</strong> {prevCgpa || "--"}
            </p>
            <p>
              <strong>Expected New CGPA:</strong>{" "}
              {expectedCgpa !== null ? expectedCgpa.toFixed(2) : "--"}
            </p>
          </section>
        </>
      )}

      {activeTab === "internal" && <InternalCalculator />}
    </div>
  );
}
