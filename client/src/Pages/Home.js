import { useEffect } from "react";
import TaskManager from "./HomeComponents/TaskManager";
import Cal from "./HomeComponents/Calendar";
import GraphicalAnalysis from "./HomeComponents/Graphical_Analysis";

function Home({ setPage, setLoggedIn }) {
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
    <div className="Page" id="profile_page">
      <div id="block1"></div>
      <div id="block2"><Cal/></div>
      <div id="block3">
        <TaskManager setPage={setPage} />
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
