// src/GradeInput.js
import React from "react";

export default function GradeInput({ value, onChange }) {
  const handleChange = (e) => {
    const v = e.target.value;

    // allow empty while typing
    if (v === "") {
      onChange("");
      return;
    }

    let num = Number(v);

    // keep it between 0 and 10
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > 10) num = 10;

    onChange(num.toString());
  };

  return (
    <input
      type="number"
      min="0"
      max="10"
      step="0.01"
      placeholder="e.g. 9 or 8 or 10"
      value={value}
      onChange={handleChange}
      style={{
        width: "90px",
        padding: "6px",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }}
    />
  );
}
