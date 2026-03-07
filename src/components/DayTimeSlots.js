import React,{useState,useEffect} from "react";
import TimeSlotCard from './TimeSlotCard';
import AddTaskModal from './AddTaskModal';
import {useUserTasks} from './UserTasksContext'






export default function DayTimeSlots({
  dayStartAt = "00:00", //"07:00" -"19:00"
  dayEndAt = "25:00",
  slotMinutes = 30,
  slotHeight = 40,
  inTasks = [],
  allTasks = [],
  renderTask,
  handlers
}) {
const [addTaskModal,setAddTaskModal]=useState(false);
const [defaultDateTime,setDefaultDateTime]=useState(false);
const [tasks, setTasks]=useState([]);
const {updateTask,moveTaskTo,moveTaskTime} = useUserTasks();
//const [height,setHeight]=useState(null);


const DAY_START = "07:00";      // always fixed
const SLOT_HEIGHT = 40;         // px per slot
const SLOT_MINUTES = 30;        // minutes per slot
const PIXELS_PER_MINUTE = 1.33  //px per minute


  const toMinutes = (t) => {
	if(t){
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
	}
	return null;
  };

const DAY_START_MIN = toMinutes(DAY_START)


   
function roundToNearestHalfHour(dateString, duration) {
	
const durationMinutes =  duration.includes("min")? parseFloat(duration.match(/[\d.]+/)[0]): parseFloat(duration.match(/[\d.]+/)[0]) * 60;


  const date = new Date(dateString);

  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Round to nearest 30 minutes
  if (minutes < 15) {
    minutes = 0;
  } else if (minutes < 45) {
    minutes = 30;
  } else {
    minutes = 0;
    hours += 1;
  }

  // Build rounded start time
  const start = new Date(date);
  start.setHours(hours, minutes, 0, 0);

  // Add duration for end time
  const end = new Date(start.getTime() + durationMinutes * 60000);

  // Format HH:MM
  const fmt = (d) =>
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0");

  return {
    startTime: fmt(start),
    endTime: fmt(end),
	durationMinutes,
  };
}
  


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
  
  function fn_defaultDateTime(timeString) {
  
  const [h, m] = timeString.split(":");

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 0-based
  const day = String(now.getDate()).padStart(2, "0");

  //return new Date(year, month, day, h, m, 0, 0);
  return `${year}-${month}-${day}T${h}:${m}`;
}


  
  
  useEffect(() => {
	var tasks=inTasks.filter((t) => t.currentPlan === "today").map((t,id) =>
						{var taskTimes=roundToNearestHalfHour(t.dateTime,t.duration);
						return { ...t,startAt:taskTimes.startTime,endAt:taskTimes.endTime,durationMinutes:taskTimes.durationMinutes};
						});
   setTasks(tasks);
  }, [inTasks]);

  
  const tasksWithLanes = React.useMemo(() => {
  const sorted = [...tasks].sort(
    (a, b) => toMinutes(a.startAt) - toMinutes(b.startAt)
  );

  const lanes = [];

  // 1. Assign lane index to each task
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

  // 2. Compute total lanes *per task* (not global)
  sorted.forEach((task) => {
    const start = toMinutes(task.startAt);
    const end = toMinutes(task.endAt);

    const overlappingLaneCount = lanes.filter((lane) =>
      lane.some((t) => start < t.end && end > t.start)
    ).length;

    task.totalLanes = overlappingLaneCount || 1;
  });

  return sorted;
}, [tasks]);
  
  
  const handleAddTaskModal =(slot) => {
	setDefaultDateTime(fn_defaultDateTime(slot));
	setAddTaskModal(true);  
  }
  
  function handleDropOnTimeline(e) {
  e.preventDefault();
  e.stopPropagation();

  
  console.log('In handleDropOnTimeline');
  console.log(e);

  const taskId = e.dataTransfer.getData("taskId");
  const task = inTasks.find(t => t.id === taskId);
  console.log(taskId);
  console.log(task);
  
  
  if(task.currentPlan !=="today") moveTaskTo(task,"today");
  

  const rect = e.currentTarget.getBoundingClientRect();
  const offsetY = e.clientY - rect.top; // px from top of timeline

  updateTaskTimeFromDrop(task, offsetY);
}

function updateTaskTimeFromDrop(task, offsetY) {
	console.log('In updateTaskTimeFromDrop');
	console.log(task);
	console.log(tasks);
  // Convert px → minutes from day start
  const minutesFromStart = (offsetY / SLOT_HEIGHT) * SLOT_MINUTES;

  // Absolute minutes from midnight
  const absoluteMinutes = DAY_START_MIN + minutesFromStart;

  // Round to nearest 30 minutes
  const rounded = Math.round(absoluteMinutes / 30) * 30;
  

  // Compute start time
  const startH = Math.floor(rounded / 60);
  const startM = rounded % 60;

  const startTime = `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`;
  const dateTime=fn_defaultDateTime(startTime);
  
  
  moveTaskTime(task, dateTime);
  
	
function computeOverlaps(tasks) {
  const sorted = [...tasks].sort((a, b) => a.startAt - b.startAt);
  const lanes = [];

  const result = sorted.map(task => {
    let laneIndex = lanes.findIndex(laneEnd => laneEnd <= task.startAt);
    if (laneIndex === -1) {
      laneIndex = lanes.length;
      lanes.push(task.endAt);
    } else {
      lanes[laneIndex] = task.endAt;
    }
    return { ...task, lane: laneIndex };
  });

  return result;
}


setTasks(prev => {
  // 1. Update the changed task's dateTime
  const updated = prev.map(t =>
    t.taskId === task.taskId
      ? { ...t, dateTime }
      : t
  );

  // 2. Normalize times
  const withTimes = updated.map(t => {
    const { startTime, endTime, durationMinutes } =
      roundToNearestHalfHour(t.dateTime, t.duration);
    return {
      ...t,
      startAt: startTime,
      endAt: endTime,
      durationMinutes
    };
  });

  // 3. Recompute lanes + per-task totalLanes
  const sorted = [...withTimes].sort(
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
  
  
  console.log('In computing lanes');
  console.log(lanes);

  sorted.forEach((task) => {
    const start = toMinutes(task.startAt);
    const end = toMinutes(task.endAt);

    const overlappingLaneCount = lanes.filter((lane) =>
      lane.some((t) => start < t.end && end > t.start)
    ).length;

    task.totalLanes = overlappingLaneCount || 1;
	//task.totalLanes = 2;
  });

  return sorted;
});


 
}

const handleResize = (height) =>{};


  return (
    <div className="timeline-day thin-scroll" style={{ overflowY: "auto", height: "100%" }}>
      <div
        className="timeline-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr",
          position: "relative"
        }}
		onDragOver={(e) => e.preventDefault()}
		onDrop={(e) => handleDropOnTimeline(e)}
        >
        {/* Sticky time column */}
        <div
          className="time-col"
          style={{
            position: "sticky",
            left: 0,
            top: 0,
            background:  "#fff",
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
				background1: "#E8EBE6",
                height: slotHeight,
                borderBottom: "#201e1e"  //#ded6d6"      // "1px solid #eee"
              }}
			  onClick={() => handleAddTaskModal(slot)}
            />
          ))}

          {tasksWithLanes.map((task) => {
            const startMin = toMinutes(task.startAt);
            const endMin = toMinutes(task.endAt);

            const top = (startMin - dayStartMin) / minutesPerPixel;
            //const height = (endMin - startMin) / minutesPerPixel;
			const height = 1.3*task.durationMinutes;
			

            const width = 100 /task.totalLanes;
            const left = task.lane * width;

        return (

               <TimeSlotCard
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
                key={task.taskId}
                task={task}
                onOpen={() => handlers.openDetail(true)}
                onToggleDone={handlers.toggleDone}
                draggableProps={handlers}
              />
            );
          })}
        </div>
      </div>
	  {addTaskModal && (
		<AddTaskModal
        open={addTaskModal}
		defaultCurrentPlan='today'
        defaultDateTime={defaultDateTime}
        onClose={() => setAddTaskModal(false)}
        onSubmit={handlers.submitAddTask}
      />
	
	)}
    </div>
  );
}

/*
<Rnd
				disableDragging={true}
				enableResizing={{
				bottom: true,
				top: false,
				left: false,
				right: false,
				bottomLeft: false,
				bottomRight: false,
				topLeft: false,
				topRight: false
				}}
				onResizeStop={(e, direction, ref) => {handleResizeStop(e, direction, ref,task)}}
				>
*/