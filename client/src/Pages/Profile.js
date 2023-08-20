import { useEffect } from "react";
import TaskManager from "./HomeComponents/TaskManager";

const tasks = [
  {
    title: "Science Homework",
    description: "Science homework page 12 problem 1 - 7",
    due_date: new Date(Date.now() + 86400000),
  },
  {
    title: "Math Homework",
    description: "Math homework page 25 problem 10 - 17",
    due_date: new Date(Date.now() + 86400000),
  },
];

function Profile({ setPage, setLoggedIn }) {
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

  useEffect(() => {
    fetch("http://localhost:8080/check-login", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.loggedIn);
        console.log("inside useeffect change");
      })
      .catch((error) => {
        console.error("Error checking login state", error);
      });
  }, []);

  return (
    <div>
      <button className="intro-button" id="Logout" onClick={handleClickLogout}>
        {" "}
        Logout{" "}
      </button>
      <button className="intro-button" id="NewTask" onClick={handleNewTask}>
        {" "}
        New Task{" "}
      </button>
      <TaskManager tasks={tasks} />
    </div>
  );
}
export default Profile;
