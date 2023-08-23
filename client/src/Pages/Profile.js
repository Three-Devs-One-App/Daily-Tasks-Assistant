import { useEffect } from "react";
import TaskManager from "./HomeComponents/TaskManager";
import Cal from "./HomeComponents/Calendar";

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

  useEffect(() => {}, []);

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

      <TaskManager setPage={setPage} />
      <Cal/>
    </div>
  );
}
export default Profile;
