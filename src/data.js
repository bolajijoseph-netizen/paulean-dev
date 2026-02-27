export const initialColumns = {
  today: { id: 'today', title: "Today's Plan" },
  yesterday: { id: 'yesterday', title: 'Yesterday' },
  urgent: { id: 'urgent', title: 'Urgent' },
  paulean: { id: 'paulean', title: '✦ Paulean' },
  backlog: { id: 'backlog', title: 'Backlog' },
};

export const initialTasks = [
  { id: 't1', title: 'Update website for Google business client', time: '9:00 AM', dur: '1h', col: 'today' },
  { id: 't2', title: 'Book flight to Rome for Italy trip', time: '10:00 AM', col: 'today', paulean: true, prog: 65 },
  { id: 't3', title: 'Finish Building ERP', time: '10:30 AM', dur: '2h', col: 'today' },
  { id: 't4', title: 'Return Lyft Laptop', time: '1:00 PM', dur: '30m', col: 'today' },
  { id: 't5', title: 'Get back to Taisha on delegated legal', time: '2:00 PM', col: 'today', paulean: true, prog: 20 },
  { id: 't6', title: 'Write contract for JB', time: '4:00 PM', dur: '1h', col: 'today' },
  { id: 'u1', title: 'Compile SBA expenses', time: 'Due today', dur: '2h', col: 'urgent', urgent: true },
  { id: 'b1', title: 'Make Airbnb plan if road trip', time: 'Feb 19', col: 'backlog' },
];