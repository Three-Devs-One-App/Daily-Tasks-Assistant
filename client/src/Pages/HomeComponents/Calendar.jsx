import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Modal from "../../components/Modal";
function Cal({ tasks }) {
  const [taskInfo, setShowTaskInfo] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const findTaskByDate = (date) => {
    return tasks.filter((task) => {
      //conversion of task date
      const tasksDate = new Date(task.due_date);
      return (
        date.getFullYear() === tasksDate.getFullYear() &&
        date.getMonth() === tasksDate.getMonth() &&
        date.getDate() === tasksDate.getDate()
      );
    });
  };

  const CategorizeTask = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const tasksOnThisDate = tasks.filter((task) => {
      const tasksDate = new Date(task.due_date);
      tasksDate.setHours(0, 0, 0, 0);
      return tasksDate.getTime() === taskDate.getTime();
    });

    // No tasks found for this date
    if (tasksOnThisDate.length === 0) return 0;

    const allDone = tasksOnThisDate.every((task) => task.on_time === true);
    const allNotDone = tasksOnThisDate.every((task) => task.on_time === false);
    const someDone = tasksOnThisDate.some((task) => task.on_time === true);
    const someNotDone = tasksOnThisDate.some((task) => task.on_time === false);

    if (taskDate < today) {
      if (allDone) return 1;
      if (allNotDone) return 2;
      if (someDone && someNotDone) return 3;
    } else if (taskDate.getTime() === today.getTime()) {
      if (allDone) return 4;
      if (allNotDone) return 5;
      if (someDone && someNotDone) return 6;
    } else if (taskDate > today) {
      if (allDone) return 8;
      if (allNotDone) return 9;
      if (someDone && someNotDone) return 10;
    }

    return 7; // Default case
  };

  return (
    <div id="calendar-container">
      <button id="RefreshButton"onClick={fetchTasks}>Refresh</button>
      <Calendar
      
        className="calendar"
        tileClassName={({ date, view }) => {
          // Check if current date is in special dates array
          const tasksOnThisDate = findTaskByDate(date);
          var tCat = CategorizeTask(date);
          if (tCat === 1 && view === "month" && tasksOnThisDate.length > 0) {
            return "allFinishedB4";
          } else if (
            tCat === 2 &&
            view === "month" &&
            tasksOnThisDate.length > 0
          ) {
            return "allFailB4";
          } else if (
            tCat === 3 &&
            view === "month" &&
            tasksOnThisDate.length > 0
          ) {
            return "someFinishedB4";
          } else if (
            tCat === 4 &&
            view === "month" &&
            tasksOnThisDate.length > 0
          ) {
            return "allFinishedToday";
          } else if (
            tCat === 5 &&
            view === "month" &&
            tasksOnThisDate.length > 0
          ) {
            return "allFailToday";
          } else if (
            tCat === 6 &&
            view === "month" &&
            tasksOnThisDate.length > 0
          ) {
            return "someFinishedToday";
          } else if (
            tCat === 8 &&
            view === "month" &&
            tasksOnThisDate.length > 0
          ) {
            return "allFinishedAfter";
          } else if (
            tCat === 9 &&
            view === "month" &&
            tasksOnThisDate.length > 0
          ) {
            return "allFailAfter";
          } else if (
            tCat === 10 &&
            view === "month" &&
            tasksOnThisDate.length > 0
          ) {
            return "someFinishedAfter";
          } else if (
            tCat === 7 &&
            view === "month" &&
            tasksOnThisDate.length > 0
          ) {
            return "highlight-date";
          }
        }}
        onClickDay={(date) => {
          const tasksOnThisDate = findTaskByDate(date);
          if (tasksOnThisDate.length > 0) {
            console.log("tasks set");
            setShowTaskInfo(tasksOnThisDate);
            setOpenModal(true);
          }
        }}
      />
      {openModal && (
        <Modal>
          {taskInfo && taskInfo.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                padding: "10px",
                border: "1px solid black",
                width: "200px",
              }}
            >
              {taskInfo.map((task, index) => (
                <div
                  id="task_Modal"
                  key={index}
                  style={{
                    backgroundColor: task.on_time === true ? "pink" : "yellow",
                  }}
                >
                  <strong>Title:</strong> {task.title}
                  <br />
                  <strong>Description:</strong> {task.description}
                  <br />
                  <strong>Finished:</strong>{" "}
                  {task.on_time === null
                    ? "Not Yet"
                    : task.on_time === false
                    ? "False"
                    : "True"}
                  <hr />
                </div>
              ))}
              <button
                onClick={() => {
                  setShowTaskInfo(null);
                  setOpenModal(false);
                }}
              >
                Close
              </button>
            </div>
          )}{" "}
        </Modal>
      )}
    </div>
  );
}
export default Cal;
