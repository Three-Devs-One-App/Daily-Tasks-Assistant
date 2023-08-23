import { useState,useEffect } from "react";
import Calendar from 'react-calendar';
function Cal() {
    const [tasks, setTasks] = useState([]);
    const [taskInfo, setShowTaskInfo] = useState(null);

    useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("http://localhost:8080/Task", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log("received data");
        console.log(data);
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }
    };
    fetchTasks();
  }, []);


  const findTaskByDate = date => {
    return tasks.find(task => {
        const tasksDate = new Date(task.due_date);
        return date.getFullYear() === tasksDate.getFullYear() &&
            date.getMonth() === tasksDate.getMonth() &&
            date.getDate() === tasksDate.getDate();
    });
};

    return(
        <div>
            
            <Calendar
            tileClassName={({ date, view }) => {
                // Check if current date is in special dates array
                if (view === 'month' && findTaskByDate(date)) {
                    return 'highlight-date';
                }
            }}
            onClickDay={date => {
                const task = findTaskByDate(date);
                if (task) {
                    console.log("task set")
                    setShowTaskInfo(task);
                }
            }}
            />
            {taskInfo && (
                <div style={{ backgroundColor: 'yellow' ,marginTop: '20px', padding: '10px', border: '1px solid black', width: '200px' }}>
                    <strong>Title:</strong> {taskInfo.title}
                    <br />
                    <strong>Description:</strong> {taskInfo.description}
                    <button onClick={() => setShowTaskInfo(null)}>Close</button>
                </div>
            )}
        </div>
    );
};
export default Cal;