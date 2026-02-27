// ObjectEditor.jsx
import React from "react";

export default function ObjectEditor({ value, onChange, renderExtra }) {
  const updateKey = (oldKey, newKey) => {
    const updated = { ...value };
    updated[newKey] = updated[oldKey];
    delete updated[oldKey];
    onChange(updated);
  };

  const updateValue = (key, newVal) => {
    onChange({ ...value, [key]: newVal });
  };

  const addField = () => {
    let newKey = "newField";
    let counter = 1;
    while (value[newKey]) newKey = `newField${counter++}`;
    onChange({ ...value, [newKey]: "" });
  };

  const removeField = (key) => {
    const updated = { ...value };
    delete updated[key];
    onChange(updated);
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 8, borderRadius: 4 }}>
      {Object.entries(value).map(([key, val]) => (
        <div
          key={key}
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 6,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={key}
            onChange={(e) => updateKey(key, e.target.value)}
            style={{ width: "30%" }}
          />

          <input
            type="text"
            value={val}
            onChange={(e) => updateValue(key, e.target.value)}
            style={{ flex: 1 }}
          />

          {renderExtra && renderExtra(key)}

          <button
            onClick={() => removeField(key)}
            style={{ color: "red", fontSize: 12 }}
          >
            x
          </button>
        </div>
      ))}

      <button onClick={addField} style={{ fontSize: 12 }}>
        + Add Field
      </button>
    </div>
  );
}