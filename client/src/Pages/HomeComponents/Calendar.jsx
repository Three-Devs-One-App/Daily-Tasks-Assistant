import { useState,useEffect } from "react";
import Calendar from 'react-calendar';
function Cal() {
    const [tasks, setTasks] = useState([]);
    const [taskInfo, setShowTaskInfo] = useState([]);

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
    return tasks.filter(task => {
        //conversion of task date
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
                const tasksOnThisDate = findTaskByDate(date);
                if (view === 'month' && tasksOnThisDate.length > 0) {
                    return 'highlight-date';
                }
            }}
            onClickDay={date => {
                const tasksOnThisDate = findTaskByDate(date);
                if (tasksOnThisDate.length > 0) {
                    console.log("tasks set");
                    setShowTaskInfo(tasksOnThisDate);
                }
            }}
            />
            
            {taskInfo && taskInfo.length > 0 && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid black', width: '200px' }}>
            {taskInfo.map((task, index) => (
                <div id='task_Modal' key={index}>
                    <strong>Title:</strong> {task.title}
                    <br />
                    <strong>Description:</strong> {task.description}
                    <hr />
                </div>
            ))}
            <button onClick={() => setShowTaskInfo(null)}>Close</button>
    </div>
)}
        </div>
    );
};
export default Cal;