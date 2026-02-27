import React from "react";

export default function TimelineDay({
  dayStartAt = "07:00",
  dayEndAt = "19:00",
  slotMinutes = 30,
  slotHeight = 40,
  tasks = [],
  renderTask
}) {
  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const formatAMPM = (time24) => {
    let [h, m] = time24.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, "0")} ${suffix}`;
  };

  const dayStartMin = toMinutes(dayStartAt);
  const minutesPerPixel = slotMinutes / slotHeight;

  const slots = React.useMemo(() => {
    const out = [];
    let t = toMinutes(dayStartAt);
    const end = toMinutes(dayEndAt);

    while (t < end) {
      const h = String(Math.floor(t / 60)).padStart(2, "0");
      const m = String(t % 60).padStart(2, "0");
      out.push(`${h}:${m}`);
      t += slotMinutes;
    }
    return out;
  }, [dayStartAt, dayEndAt, slotMinutes]);

  const tasksWithLanes = React.useMemo(() => {
    const sorted = [...tasks].sort(
      (a, b) => toMinutes(a.startAt) - toMinutes(b.startAt)
    );

    const lanes = [];

    sorted.forEach((task) => {
      const start = toMinutes(task.startAt);
      const end = toMinutes(task.endAt);

      let laneIndex = 0;

      while (true) {
        const lane = lanes[laneIndex];

        if (!lane) {
          lanes[laneIndex] = [{ start, end }];
          break;
        }

        const overlaps = lane.some(
          (t) => start < t.end && end > t.start
        );

        if (!overlaps) {
          lane.push({ start, end });
          break;
        }

        laneIndex++;
      }

      task.lane = laneIndex;
    });

    const maxLane = Math.max(...sorted.map((t) => t.lane), 0);
    sorted.forEach((t) => (t.totalLanes = maxLane + 1));

    return sorted;
  }, [tasks]);

  return (
    <div className="timeline-day" style={{ overflowY: "auto", height: "100%" }}>
      <div
        className="timeline-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr",
          position: "relative"
        }}
      >
        {/* Sticky time column */}
        <div
          className="time-col"
          style={{
            position: "sticky",
            left: 0,
            top: 0,
            background: "#fff",
            zIndex: 10,
            borderRight: "1px solid #ddd"
          }}
        >
          {slots.map((slot) => (
            <div
              key={slot}
              className="time-slot"
              style={{
                height: slotHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 8,
                fontSize: 12,
                color: "#555",
                borderBottom: "1px solid #eee"
              }}
            >
              {formatAMPM(slot)}
            </div>
          ))}
        </div>

        {/* Task column */}
        <div className="task-col" style={{ position: "relative" }}>
          {slots.map((slot) => (
            <div
              key={slot}
              className="slot-bg"
              style={{
                height: slotHeight,
                borderBottom: "1px solid #eee"
              }}
            />
          ))}

          {tasksWithLanes.map((task) => {
            const startMin = toMinutes(task.startAt);
            const endMin = toMinutes(task.endAt);

            const top = (startMin - dayStartMin) / minutesPerPixel;
            const height = (endMin - startMin) / minutesPerPixel;

            const width = 100 / task.totalLanes;
            const left = task.lane * width;

            return (
              <div
                key={task.id}
                className="task-card"
                style={{
                  position: "absolute",
                  top,
                  height,
                  left: `${left}%`,
                  width: `${width}%`,
                  background: "#fff",
                  borderRadius: 6,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  padding: "6px 8px",
                  overflow: "hidden",
                  borderLeft: "4px solid #4A90E2"
                }}
              >
                {renderTask ? renderTask(task) : task.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/*

<DayTimeSlots
  tasks={[
    { id: 1, title: "Design UI", status: "todo", startAt: "09:00", endAt: "10:00" },
    { id: 2, title: "API Work", status: "doing", startAt: "09:30", endAt: "11:00" },
    { id: 3, title: "Testing", status: "done", startAt: "10:00", endAt: "10:30" }
  ]}
  renderTask={(task) => (
    <div className="task-card">{task.title}</div>
  )}
/>

*/

/* Utility to generate 30‑minute slots */


/*
.kanban-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  font-family: system-ui, sans-serif;
}

.kanban-header-row {
  display: grid;
  grid-template-columns: 90px 1fr 1fr 1fr;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
  background: #fafafa;
  position: sticky;
  top: 0;
  z-index: 2;
}

.kanban-scroll {
  max-height: 480px; /* ~8 hours visible */
  overflow-y: auto;
  border: 1px solid #eee;
  border-top: none;
}

.kanban-row {
  display: grid;
  grid-template-columns: 90px 1fr 1fr 1fr;
  min-height: 48px;
  border-bottom: 1px solid #f0f0f0;
}

.col {
  padding: 8px;
  display: flex;
  align-items: center;
}

.time-col {
  font-size: 12px;
  color: #666;
  justify-content: flex-end;
  border-right: 1px solid #eee;
}
.cell {
  position: relative;
  background: #fffbe6; /* light yellow paper */
  border: 1px solid #e0dcb8;
  border-radius: 6px;
  padding: 8px;
  box-sizing: border-box;

  /* horizontal ruling */
  background-image:
    repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.08) 0px,
      rgba(0, 0, 0, 0.08) 1px,
      transparent 1px,
      transparent 28px
    );

  /* vertical margin line */
  background-size: 100% 30px;
}
.cell::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 40px; /* margin width */
  width: 1px;
  background: rgba(255, 80, 80, 0.4); /* soft red margin line */
  pointer-events: none;
}

