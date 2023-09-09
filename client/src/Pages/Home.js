import { useEffect } from "react";
import TaskManager from "./HomeComponents/TaskManager";
import Cal from "./HomeComponents/Calendar";
import GraphicalAnalysis from "./HomeComponents/Graphical_Analysis";
import { useState } from "react";
function Home({ setPage, setLoggedIn }) {
  const [updatedTask, setUpdatedTask] = useState(false);
  const taskUpdated = () => setUpdatedTask((updatedTask) => !updatedTask);

  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("http://localhost:8080/Task", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 200) {
        const data = await res.json();
        const tasks = data.tasks.filter((task) => {
          return task.on_time === null;
        });
        tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
        setTasks(tasks);
      } else {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [updatedTask]);

  const handleClickLogout = () => {
    fetch("http://localhost:8080/Logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // This returns a promise
      })
      .then(() => {
        console.log("fontend logout");
        setPage("Login");
        setLoggedIn(false);
      })
      .catch((error) => console.log("There was an error!", error));
  };

  const handleNewTask = () => {
    setPage("Task");
  };

  useEffect(() => {}, []);

  if (!tasks) return <div>Loading...</div>;
  return (
    <div className="Page" id="profile_page">
      <div id="block1">
        <div>
          <button onClick={handleClickLogout}>Logout</button>
        </div>

        <GraphicalAnalysis />

        <div></div>
      </div>
      <div id="block2">
        <div></div>
        <Cal tasks={tasks} />
      </div>
      <div id="block3">
        <TaskManager
          tasks={tasks}
          setPage={setPage}
          taskUpdated={taskUpdated}
        />
      </div>
      {/* <TaskManager setPage={setPage} />
      <Cal/>
      <GraphicalAnalysis/> */}
    </div>
  );
}
export default Home;

/*

<div className="Page" id="profile_page">
      <div id="block1"></div>
      <div id="block2"></div>
      <div id="block3">
        <div id="task_manager">
          <div id="main_task"></div>
        </div>
      </div>
    </div>

*/
