// src/components/SettingsView.jsx
import React, { useState, useEffect } from "react";

/**
 * Props:
 * - integrations: array of { id, name, desc, icon, bg, connected }
 * - onConnectIntegration(id) -> Promise or void
 * - onShowNotif(title, message, type)
 * - initialWorkHours: { start: "08:00", end: "17:00" }
 * - onSaveWorkHours({ start, end, grid }) 
 * - initialGrid: 2D array [rows][cols] of booleans (true = work)
 * - onToggleWorkPaulean(enabled)
 * - onToggleAutoWork(enabled)
 * - onToggleAskWork(enabled)
 * - locations: array of { id, label, value }
 * - onUpdateLocation(id)
 */
export default function SettingsView({
  integrations: initialIntegrations = [
    { id: "google", name: "Google Calendar", desc: "Work calendar ， tolu@company.com ， Last synced 2m ago", icon: "??", bg: "#EAF3FF", connected: true },
    { id: "outlook", name: "Microsoft Outlook", desc: "Work calendar ， tolu@company.com ， Last synced 2m ago", icon: "??", bg: "#EAF3FF", connected: true },
    { id: "icloud", name: "Apple iCloud Calendar", desc: "Personal ， Not connected", icon: "??", bg: "#F2F2F7", connected: false },
  ],
  onClose,
  onConnectIntegration = (id) => {},
  onShowNotif = (title, msg, type) => {},
  initialWorkHours = { start: "08:00", end: "17:00" },
  onSaveWorkHours = (payload) => {},
  initialGrid = null, // if null, component will create a default grid
  onToggleWorkPaulean = (enabled) => {},
  onToggleAutoWork = (enabled) => {},
  onToggleAskWork = (enabled) => {},
  locations: initialLocations = [
    { id: "home", label: "Home", value: "Wesley Chapel, FL 33544" },
    { id: "office", label: "Office", value: "4830 W Kennedy Blvd, Tampa, FL" },
    { id: "current", label: "Current Location", value: "Wesley Chapel, FL ， Updated 1m ago" },
  ],
  onUpdateLocation = (id) => {},
}) {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [workStart, setWorkStart] = useState(initialWorkHours.start);
  const [workEnd, setWorkEnd] = useState(initialWorkHours.end);
  
  useEffect(() => { console.log("SettingsView mounted"); }, []);



  // grid: rows = time labels (e.g., 8 AM, 12 PM, 5 PM), cols = Mon-Fri
  const defaultGrid = [
    // header row omitted; grid cells only
    // row for 8 AM
    ["work", "work", "work", "work", "work"],
    // row for 12 PM
    ["work", "work", "work", "work", "work"],
    // row for 5 PM
    ["off", "off", "off", "off", "off"],
  ];
  const [grid, setGrid] = useState(initialGrid || defaultGrid);

  const [workPaulean, setWorkPaulean] = useState(true);
  const [autoWork, setAutoWork] = useState(false);
  const [askWork, setAskWork] = useState(true);

  const [locations, setLocations] = useState(initialLocations);

/*
  useEffect(() => {
    setIntegrations(initialIntegrations);
  }, [initialIntegrations]);
  
  */

  function handleConnect(id) {
    const item = integrations.find((i) => i.id === id);
    if (item?.connected) {
      onShowNotif(item.name, "Already connected ！ syncing every 5 min.", "g");
      return;
    }
    // optimistic UI
    setIntegrations((prev) => prev.map((p) => (p.id === id ? { ...p, connected: true } : p)));
    Promise.resolve(onConnectIntegration(id)).catch(() => {
      // revert on error
      setIntegrations((prev) => prev.map((p) => (p.id === id ? { ...p, connected: false } : p)));
    });
  }

  function toggleCell(rowIdx, colIdx) {
    setGrid((g) => {
      const next = g.map((r) => r.slice());
      next[rowIdx][colIdx] = next[rowIdx][colIdx] === "work" ? "off" : "work";
      return next;
    });
  }

  function handleSaveWorkHours() {
    onSaveWorkHours({ start: workStart, end: workEnd, grid });
  }

  function toggleSw(setter, value) {
    setter((v) => !v);
  }

  function updateLocation(id) {
    onUpdateLocation(id);
    // optionally update UI (simulate)
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, value: l.value + " ， Updated now" } : l))
    );
  }

  return (
    <div className="settingsView `chat-overlay ${open ? 'open' : ''}`" id="settings-view" onClick={onClose}>
		<div className="chat-x" onClick={onClose}>?</div>
      {/* Calendar Integrations */}
      <div className="scard">
        <div className="scard-hdr">
          <div>
            <div className="scard-title"><span> ??Calendar Integrations</span></div>
            <div className="scard-sub">Sync your calendars so tasks appear on your board</div>
          </div>
        </div>

        <div className="scard-body">
          {integrations.map((intg) => (
            <div className="cal-int-row" key={intg.id}>
              <div className="cal-int-icon" style={{ background: intg.bg }}>{intg.icon}</div>
              <div className="cal-int-info">
                <div className="cal-int-name">{intg.name}</div>
                <div className="cal-int-desc">{intg.desc}</div>
              </div>
              <button
                className={`connect-btn ${intg.connected ? "connected" : "disconnected"}`}
                onClick={() => handleConnect(intg.id)}
              >
                {intg.connected ? "? Connected" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Work Hours */}
      <div className="scard">
        <div className="scard-hdr">
          <div>
            <div className="scard-title">?? Work Hours</div>
            <div className="scard-sub">Paulean won't book personal appointments in these windows without asking</div>
          </div>
          <button className="btn-blue" style={{ padding: "6px 14px", fontSize: 12 }} onClick={handleSaveWorkHours}>
            Save
          </button>
        </div>

        <div className="scard-body">
          <div className="wh-range-row" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text3)" }}>Work hours:</span>
            <input type="time" className="wh-time-inp" id="work-start" value={workStart} onChange={(e) => setWorkStart(e.target.value)} />
            <span style={{ fontSize: 13, color: "var(--text4)" }}>to</span>
            <input type="time" className="wh-time-inp" id="work-end" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} />
          </div>

          {/* Visual day/time grid */}
          <div className="work-hours-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, alignItems: "center", marginBottom: 10 }}>
            <div className="wh-day-label" />
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
              <div className="wh-day-label" key={d}>{d}</div>
            ))}

            {["8 AM", "12 PM", "5 PM"].map((label, rowIdx) => (
              <React.Fragment key={label}>
                <div className="wh-label">{label}</div>
                {grid[rowIdx].map((cell, colIdx) => (
                  <div
                    key={colIdx}
                    className={`wh-cell ${cell === "work" ? "work-block" : "off"}`}
                    onClick={() => toggleCell(rowIdx, colIdx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && toggleCell(rowIdx, colIdx)}
                  >
                    <span className={`wh-time ${cell === "off" ? "off" : ""}`}>{cell === "work" ? "Work" : "Off"}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div style={{ fontSize: 11.5, color: "var(--text4)", lineHeight: 1.5 }}>
            Tap any block to toggle. Work blocks = Paulean will ask before scheduling personal tasks. Click Save when done.
          </div>
        </div>
      </div>

      {/* Paulean for Work */}
      <div className="scard">
        <div className="scard-hdr">
          <div>
            <div className="scard-title">? Paulean for Work</div>
            <div className="scard-sub">Let Paulean manage tasks from your work calendar</div>
          </div>
        </div>

        <div className="scard-body">
          <div className="toggle-row" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div className="toggle-info">
              <div className="toggle-label">Use Paulean for Work Tasks</div>
              <div className="toggle-desc">Paulean will see work calendar events and ask before acting on work-related tasks. Some tasks ！ like scheduling, research, and email follow-ups ！ can be handled automatically.</div>
            </div>
            <div className="toggle-sw">
              <div className={`sw ${workPaulean ? "on" : ""}`} id="work-toggle" onClick={() => { setWorkPaulean(!workPaulean); onToggleWorkPaulean(!workPaulean); }} />
            </div>
          </div>

          {workPaulean && (
            <div className="work-warning" id="work-warning-shown" style={{ marginTop: 10 }}>
              <div className="work-warning-title">?? Work tasks enabled</div>
              <div className="work-warning-desc">Paulean can see your work calendar. It will ask before acting on any work task unless you've set it to auto-handle low-stakes tasks (scheduling, research, email drafts). Work tasks are shown in purple on your board and labeled "Work".</div>
            </div>
          )}

          <div className="toggle-row" style={{ marginTop: 12 }}>
            <div className="toggle-info">
              <div className="toggle-label">Auto-handle low-stakes work tasks</div>
              <div className="toggle-desc">Scheduling, follow-ups, research, agenda prep. Paulean acts immediately and notifies you after.</div>
            </div>
            <div className="toggle-sw">
              <div className={`sw ${autoWork ? "on" : ""}`} id="auto-work-toggle" onClick={() => { setAutoWork(!autoWork); onToggleAutoWork(!autoWork); }} />
            </div>
          </div>

          <div className="toggle-row" style={{ marginTop: 8 }}>
            <div className="toggle-info">
              <div className="toggle-label">Ask before every work task</div>
              <div className="toggle-desc">Paulean will always confirm with you before acting on a work-related task, regardless of complexity.</div>
            </div>
            <div className="toggle-sw">
              <div className={`sw ${askWork ? "on" : ""}`} id="ask-work-toggle" onClick={() => { setAskWork(!askWork); onToggleAskWork(!askWork); }} />
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="scard" id="settings-location">
        <div className="scard-hdr">
          <div>
            <div className="scard-title">?? Location &amp; Travel</div>
            <div className="scard-sub">Paulean uses location to optimize your schedule and alert you about traffic</div>
          </div>
        </div>

        <div className="scard-body">
          {locations.map((loc) => (
            <div className="loc-field" key={loc.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div className="loc-field-icon" style={{ fontSize: 20 }}>{loc.id === "home" ? "??" : loc.id === "office" ? "??" : "??"}</div>
              <div className="loc-field-info">
                <div className="loc-field-label">{loc.label}</div>
                <div className="loc-field-val">{loc.value}</div>
              </div>
              <div className="loc-edit-btn" onClick={() => updateLocation(loc.id)} style={{ marginLeft: "auto", cursor: "pointer" }}>
                {loc.id === "current" ? "Update" : "Edit"}
              </div>
            </div>
          ))}

          <div className="toggle-row" style={{ marginTop: 8 }}>
            <div className="toggle-info">
              <div className="toggle-label">Live Location</div>
              <div className="toggle-desc">Paulean monitors traffic and alerts you (via call + push) if you need to leave early for an appointment. Agents call if you're likely to be late.</div>
            </div>
            <div className="toggle-sw"><div className="sw on" id="live-loc-toggle" onClick={() => toggleSw(setWorkPaulean)} /></div>
          </div>

          <div className="toggle-row" style={{ marginTop: 8 }}>
            <div className="toggle-info">
              <div className="toggle-label">Traveling Mode</div>
              <div className="toggle-desc">Update your current location easily when you're away from home. Paulean adjusts appointment options based on where you are.</div>
            </div>
            <div className="toggle-sw"><div className="sw" id="travel-toggle" onClick={() => toggleSw(setAutoWork)} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
/*

// App.jsx (excerpt)
import React from "react";
import SettingsView from "./components/SettingsView";

export default function App() {
  function connectCal(id) { console.log("connect", id); }
  function showNotif(title, msg, type) { console.log("notif", title, msg, type); }
  function saveWorkHours(payload) { console.log("save work hours", payload); }
  function toggleWorkPaulean(enabled) { console.log("work paulean", enabled); }
  function updateLocation(id) { console.log("update location", id); }

  return (
    <SettingsView
      onConnectIntegration={connectCal}
      onShowNotif={showNotif}
      onSaveWorkHours={saveWorkHours}
      onToggleWorkPaulean={toggleWorkPaulean}
      onUpdateLocation={updateLocation}
    />
  );
}
*/
