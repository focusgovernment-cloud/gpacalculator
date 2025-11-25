// src/App.js
import React, { useState } from "react";
import subjects from "./subjects";
import GradeInput from "./GradeInput";
import "./App.css";

/*
  IMPORTANT:
  Set this to the TOTAL CREDITS you have already completed
  in all previous semesters (before the subjects in this list).

  Example:
    If each earlier semester has 20 credits and you finished 4 sems,
    then PREVIOUS_TOTAL_CREDITS = 80.

  Change this number once and then you never have to touch it again.
*/
const PREVIOUS_TOTAL_CREDITS = 81; // <-- 🔁 CHANGE to your real value

function App() {
  // store grade points (as strings) for each subject of this semester
  const [grades, setGrades] = useState(
    subjects.reduce((acc, _, idx) => {
      acc[idx] = "";
      return acc;
    }, {})
  );

  const [prevCgpa, setPrevCgpa] = useState(""); // previous overall CGPA

  const [sgpa, setSgpa] = useState(null);           // this sem SGPA
  const [expectedCgpa, setExpectedCgpa] = useState(null); // overall CGPA

  const currentSemCredits = subjects.reduce(
    (sum, s) => sum + Number(s.credits),
    0
  );

  const handleGradeChange = (index, grade) => {
    setGrades((prev) => ({ ...prev, [index]: grade }));
  };

  const calculate = () => {
    // ------- 1. Calculate SGPA for this semester -------
    let weightedSum = 0;

    subjects.forEach((subj, idx) => {
      let gp = parseFloat(grades[idx]);

      if (isNaN(gp)) gp = 0;        // empty → 0
      if (gp < 0) gp = 0;
      if (gp > 10) gp = 10;

      weightedSum += gp * subj.credits;
    });

    const semSgpa =
      currentSemCredits === 0 ? 0 : weightedSum / currentSemCredits;

    // ------- 2. Calculate expected overall CGPA -------
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
      <h1>SGPA & Expected CGPA Calculator (R23)</h1>

      {/* ---------- This Semester Subjects ---------- */}
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
                  <GradeInput
                    value={grades[idx]}
                    onChange={(v) => handleGradeChange(idx, v)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ---------- Previous CGPA input ---------- */}
      <section className="card">
        <h2>Previous Overall CGPA</h2>
        <p className="note">
          You have already completed <strong>{PREVIOUS_TOTAL_CREDITS}</strong>{" "}
          credits before this semester (set in code).
        </p>
        <div className="input-group">
          <label>Previous CGPA (all completed sems)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={prevCgpa}
            onChange={(e) => setPrevCgpa(e.target.value)}
            placeholder="e.g., 8.25"
          />
        </div>
      </section>

      {/* ---------- Calculate button ---------- */}
      <button className="calculate-btn" onClick={calculate}>
        Calculate SGPA & Expected CGPA
      </button>

      {/* ---------- Results ---------- */}
      <section className="card results">
        <h2>Results</h2>
        <p>
          <strong>SGPA for this semester:</strong>{" "}
          {sgpa !== null ? sgpa.toFixed(2) : "--"}
        </p>
        <p>
          <strong>Previous CGPA:</strong> {prevCgpa || "--"}
        </p>
        <p>
          <strong>Expected overall CGPA (after this sem):</strong>{" "}
          {expectedCgpa !== null ? expectedCgpa.toFixed(2) : "--"}
        </p>
      </section>
    </div>
  );
}

export default App;
