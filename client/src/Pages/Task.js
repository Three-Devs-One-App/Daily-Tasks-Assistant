import { useState } from "react";

function Task({ setPage }) {
  const [Task_Name, setTask_Name] = useState("");
  const [Task_Date, setTask_Date] = useState(null);
  const [Task_Description, setTask_Description] = useState("");
  const [warning, setWarning] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateTask();
  };

  const handleCreateTask = async () => {
    const response = await fetch("http://localhost:8080/Task", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Task_Name,
        Task_Date,
        Task_Description,
      }),
    });

    const data = await response.json();
    console.log(data);
    if (data.message === "TaskAdded") {
      setPage("Profile");
    } else {
      setWarning(data.message);
    }
  };

  return (
    <div>
      <form id="Task_Form" onSubmit={handleSubmit}>
        <label>
          Task Name:
          <input
            name="Task_Name"
            type="text"
            onChange={(e) => setTask_Name(e.target.value)}
          />
        </label>
        <br />
        <label>
          Task Priority:
          <input
            name="Task_Priority"
            type="datetime-local"
            onChange={(e) => setTask_Date(e.target.value)}
          />
        </label>
        <br />
        <label>
          Task Description:
          <textarea
            name="Task_Description"
            rows="5"
            cols="50"
            onChange={(e) => setTask_Description(e.target.value)}
          ></textarea>
        </label>
        <br />
        <button type="submit">Create New Task</button>
        <br />
        {warning && <p id="warning">{warning}</p>}
      </form>
    </div>
  );
}

export default Task;
