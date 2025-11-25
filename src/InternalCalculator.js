// src/InternalCalculator.js
import React, { useState } from "react";
import "./InternalCalculator.css"; // we'll add CSS next

// helper: external marks needed for a target total
function extNeed(target, internal) {
  const r = target - internal;
  if (r <= 0) return 0;
  if (r > 70) return "Impossible"; // ext max 70
  return r.toFixed(2);
}

function GradeRow({ label, desc, target, internal }) {
  const ext = extNeed(target, internal);
  let cls = "status-normal";
  let text = `${ext} / 70`;
  if (ext === 0) {
    cls = "status-safe";
    text = "SECURED";
  } else if (ext === "Impossible") {
    cls = "status-impossible";
    text = "IMPOSSIBLE";
  }
  return (
    <tr>
      <td>
        <div className="grade-flex">
          <span className={`grade-badge bg-${label}`}>{label}</span>
          <span className="grade-desc">{desc}</span>
        </div>
      </td>
      <td className="center">
        <span className={cls}>{text}</span>
      </td>
    </tr>
  );
}

export default function InternalCalculator() {
  const [active, setActive] = useState("theory");

  // theory state
  const [theory, setTheory] = useState({ m1: "", m2: "", asn: "" });
  const [theoryInternal, setTheoryInternal] = useState(null);

  // lab state
  const [lab, setLab] = useState({ rec: "", obs: "", mod: "" });
  const [labInternal, setLabInternal] = useState(null);

  // SEC state
  const [sec, setSec] = useState({
    m1: "",
    m2: "",
    a1: "",
    a2: "",
    rec: "",
    obs: ""
  });
  const [secInternal, setSecInternal] = useState(null);

  // generic change handlers
  const handleTheoryChange = (field, value) =>
    setTheory((p) => ({ ...p, [field]: value }));
  const handleLabChange = (field, value) =>
    setLab((p) => ({ ...p, [field]: value }));
  const handleSecChange = (field, value) =>
    setSec((p) => ({ ...p, [field]: value }));

  // validation helper
  const clamp = (val, max) => {
    const n = parseFloat(val);
    if (isNaN(n) || n < 0) return "";
    return n > max ? max : n;
  };

  // calculate theory internal (max 30)
  const calcTheory = () => {
    const m1 = clamp(theory.m1, 24) || 0;
    const m2 = clamp(theory.m2, 24) || 0;
    const asn = clamp(theory.asn, 6) || 0;

    const high = Math.max(m1, m2);
    const low = Math.min(m1, m2);
    const mid = high * 0.8 + low * 0.2; // weighted
    const internal = mid + asn;

    setTheory({
      m1: m1 === "" ? "" : m1,
      m2: m2 === "" ? "" : m2,
      asn: asn === "" ? "" : asn
    });
    setTheoryInternal(internal);
  };

  // calculate lab internal (max 30)
  const calcLab = () => {
    const rec = clamp(lab.rec, 10) || 0;
    const obs = clamp(lab.obs, 10) || 0;
    const mod = clamp(lab.mod, 10) || 0;
    const internal = rec + obs + mod;

    setLab({ rec, obs, mod });
    setLabInternal(internal);
  };

  // calculate SEC internal (max 30)
  const calcSec = () => {
    const m1 = clamp(sec.m1, 14) || 0;
    const m2 = clamp(sec.m2, 14) || 0;
    const a1 = clamp(sec.a1, 3) || 0;
    const a2 = clamp(sec.a2, 3) || 0;
    const rec = clamp(sec.rec, 5) || 0;
    const obs = clamp(sec.obs, 5) || 0;

    const high = Math.max(m1, m2);
    const low = Math.min(m1, m2);
    const mid = high * 0.8 + low * 0.2;
    const internal = mid + a1 + a2 + rec + obs;

    setSec({ m1, m2, a1, a2, rec, obs });
    setSecInternal(internal);
  };

  const clearTheory = () => {
    setTheory({ m1: "", m2: "", asn: "" });
    setTheoryInternal(null);
  };
  const clearLab = () => {
    setLab({ rec: "", obs: "", mod: "" });
    setLabInternal(null);
  };
  const clearSec = () => {
    setSec({ m1: "", m2: "", a1: "", a2: "", rec: "", obs: "" });
    setSecInternal(null);
  };

  // reusable result block
  const renderResult = (internal) => {
    if (internal === null) return null;
    const pct = Math.min((internal / 30) * 100, 100);
    return (
      <div className="result show">
        <div className="result-header">
          <div className="score-big">{internal.toFixed(2)}</div>
          <div className="score-label">Total Internal Score (30)</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Grade Target</th>
              <th>External Needed (out of 70)</th>
            </tr>
          </thead>
          <tbody>
            <GradeRow
              label="S"
              desc="Superior (90+ total)"
              target={90}
              internal={internal}
            />
            <GradeRow
              label="A"
              desc="Excellent (80+ total)"
              target={80}
              internal={internal}
            />
            <GradeRow
              label="B"
              desc="Very Good (70+ total)"
              target={70}
              internal={internal}
            />
            <GradeRow
              label="C"
              desc="Good (60+ total)"
              target={60}
              internal={internal}
            />
            <GradeRow
              label="D"
              desc="Average (50+ total)"
              target={50}
              internal={internal}
            />
            <GradeRow
              label="E"
              desc="Pass (40+ total)"
              target={40}
              internal={internal}
            />
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="internal-wrapper">
      {/* top pills */}
      <div className="navbar">
        <div className="nav-pill-container">
          <button
            className={`nav-btn ${active === "theory" ? "active" : ""}`}
            onClick={() => setActive("theory")}
          >
            Theory
          </button>
          <button
            className={`nav-btn ${active === "lab" ? "active" : ""}`}
            onClick={() => setActive("lab")}
          >
            Lab
          </button>
          <button
            className={`nav-btn ${active === "sec" ? "active" : ""}`}
            onClick={() => setActive("sec")}
          >
            SEC
          </button>
        </div>
      </div>

      {/* theory section */}
      {active === "theory" && (
        <div className="container">
          <h2>Theory Internal</h2>

          <div className="input-group">
            <label>
              First Mid Marks <span>(Max 24)</span>
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={theory.m1}
              onChange={(e) => handleTheoryChange("m1", e.target.value)}
              placeholder="e.g., 21.5"
            />
          </div>

          <div className="input-group">
            <label>
              Second Mid Marks <span>(Max 24)</span>
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={theory.m2}
              onChange={(e) => handleTheoryChange("m2", e.target.value)}
              placeholder="e.g., 19"
            />
          </div>

          <div className="input-group">
            <label>
              Assignment Marks <span>(Max 6)</span>
            </label>
            <input
              type="number"
              min="0"
              max="6"
              step="0.5"
              value={theory.asn}
              onChange={(e) => handleTheoryChange("asn", e.target.value)}
              placeholder="e.g., 5.5"
            />
          </div>

          <div className="btn-row">
            <button className="btn-calc" onClick={calcTheory}>
              Calculate
            </button>
            <button className="btn-clear" onClick={clearTheory}>
              Clear
            </button>
          </div>

          {renderResult(theoryInternal)}
        </div>
      )}

      {/* lab section */}
      {active === "lab" && (
        <div className="container">
          <h2>Lab Internal</h2>

          <div className="input-group">
            <label>
              Record Marks <span>(Max 10)</span>
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={lab.rec}
              onChange={(e) => handleLabChange("rec", e.target.value)}
              placeholder="e.g., 9"
            />
          </div>

          <div className="input-group">
            <label>
              Observation Marks <span>(Max 10)</span>
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={lab.obs}
              onChange={(e) => handleLabChange("obs", e.target.value)}
              placeholder="e.g., 8"
            />
          </div>

          <div className="input-group">
            <label>
              Model Exam Marks <span>(Max 10)</span>
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={lab.mod}
              onChange={(e) => handleLabChange("mod", e.target.value)}
              placeholder="e.g., 7.5"
            />
          </div>

          <div className="btn-row">
            <button className="btn-calc" onClick={calcLab}>
              Calculate
            </button>
            <button className="btn-clear" onClick={clearLab}>
              Clear
            </button>
          </div>

          {renderResult(labInternal)}
        </div>
      )}

      {/* SEC section */}
      {active === "sec" && (
        <div className="container">
          <h2>Skill Enhancement</h2>

          <div className="input-group">
            <label>
              Mid 1 <span>(Max 14)</span>
            </label>
            <input
              type="number"
              min="0"
              max="14"
              value={sec.m1}
              onChange={(e) => handleSecChange("m1", e.target.value)}
              placeholder="e.g., 12"
            />
          </div>

          <div className="input-group">
            <label>
              Mid 2 <span>(Max 14)</span>
            </label>
            <input
              type="number"
              min="0"
              max="14"
              value={sec.m2}
              onChange={(e) => handleSecChange("m2", e.target.value)}
              placeholder="e.g., 13"
            />
          </div>

          <div className="two-col">
            <div className="input-group">
              <label>
                Assign 1 <span>(Max 3)</span>
              </label>
              <input
                type="number"
                min="0"
                max="3"
                value={sec.a1}
                onChange={(e) => handleSecChange("a1", e.target.value)}
                placeholder="e.g., 3"
              />
            </div>
            <div className="input-group">
              <label>
                Assign 2 <span>(Max 3)</span>
              </label>
              <input
                type="number"
                min="0"
                max="3"
                value={sec.a2}
                onChange={(e) => handleSecChange("a2", e.target.value)}
                placeholder="e.g., 2.5"
              />
            </div>
          </div>

          <div className="two-col">
            <div className="input-group">
              <label>
                Record <span>(Max 5)</span>
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={sec.rec}
                onChange={(e) => handleSecChange("rec", e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
            <div className="input-group">
              <label>
                Observation <span>(Max 5)</span>
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={sec.obs}
                onChange={(e) => handleSecChange("obs", e.target.value)}
                placeholder="e.g., 4"
              />
            </div>
          </div>

          <div className="btn-row">
            <button className="btn-calc" onClick={calcSec}>
              Calculate
            </button>
            <button className="btn-clear" onClick={clearSec}>
              Clear
            </button>
          </div>

          {renderResult(secInternal)}
        </div>
      )}
    </div>
  );
}
