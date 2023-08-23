import { useState, useEffect } from "react";
const TaskManager = ({ setPage }) => {
  const [modalIdx, setModalIdx] = useState(-1);
  const [tasks, setTasks] = useState(null);
  const [warning, setWarning] = useState("");
  const [updatedTask, setUpdatedTask] = useState(false);
  const closeModal = () => setModalIdx(-1);

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
  }, [updatedTask]);

  if (!tasks) return <div>Loading ...</div>;
  else {
    return (
      <div id="task_manager">
        {modalIdx >= 0 && (
          <TaskViewEdit
            task={tasks[modalIdx]}
            closeModal={closeModal}
            setPage={setPage}
            setWarning={setWarning}
          />
        )}
        {modalIdx === -1 &&
          tasks.map((task, index) => {
            const openModal = () => setModalIdx(index);
            const removeTaskASync = async () => {
              const res = await fetch(
                `http://localhost:8080/Task?task_id=${task._id}`,
                {
                  method: "DELETE",
                  credentials: "include",
                }
              );
              if (res.status === 200) {
                setUpdatedTask((updatedTask) => !updatedTask);
              } else setWarning(await res.text());
            };
            return index === 0 ? (
              <MainTask
                task={task}
                openModal={openModal}
                removeTask={() => removeTaskASync()}
              />
            ) : (
              <Task
                task={task}
                openModal={openModal}
                removeTask={() => removeTaskASync()}
              />
            );
          })}
        <h1 style={{ color: "red" }}>{warning}</h1>
      </div>
    );
  }
};

const MainTask = ({ task, openModal, removeTask }) => {
  return (
    <div className="main-task task">
      <h1 onClick={openModal}>{task.title}</h1>
      <p>{task.description}</p>
      <h2 className="due_label">Due On: </h2>
      <h2>{task.due_date.toLocaleString()}</h2>
      <button onClick={removeTask}>-</button>
    </div>
  );
};

const Task = ({ task, openModal, removeTask }) => {
  return (
    <div className="task">
      <h1 onClick={openModal}>{task.title}</h1>
      <h2 className="due_label">Due On: </h2>
      <h2>{task.due_date.toLocaleString()}</h2>
      <button onClick={removeTask}>-</button>
    </div>
  );
};

const TaskViewEdit = ({ task, closeModal, setPage, setWarning }) => {
  const [edit, setEdit] = useState(false);

  const updateRequest = (e) => {
    e.preventDefault();
    handleUpdateRequest();
  };

  const handleUpdateRequest = async () => {
    const title = document.querySelector("#title_inp").value;
    const description = document.querySelector("#description_inp").value;
    const date = document.querySelector("#date_inp").value;

    const data = JSON.stringify({
      title: title,
      description: description,
      due_date: date,
      task_id: task._id,
    });

    const res = await fetch("http://localhost:8080/Task", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (res.ok) setPage("Profile");
    else setWarning("An error occurred");
  };

  const editItems = (
    <>
      <h1>Title: </h1>
      <input type="text" id="title_inp" defaultValue={task.title} />
      <h1>Description: </h1>
      <textarea
        type="text"
        id="description_inp"
        defaultValue={task.description}
      />
      <h1>Title: </h1>
      <input type="datetime-local" id="date_inp" />
      <button type="submit" onClick={updateRequest}>
        Submit
      </button>
    </>
  );

  const viewItems = (
    <>
      <h1>Title: </h1>
      <h1>{task.title}</h1>
      <h1>Description:</h1>
      <h1>{task.description}</h1>
      <h1>Due Date:</h1>
      <h1>{task.due_date.toLocaleString()}</h1>
    </>
  );

  const editButton = <button onClick={() => setEdit(true)}>Edit</button>;
  const viewButton = <button onClick={() => setEdit(false)}>View</button>;

  return (
    <div id="task-modal-container">
      <button onClick={closeModal}>Close</button>
      <div id="task-modal">
        {edit ? (
          <>
            {editItems}
            {viewButton}
          </>
        ) : (
          <>
            {viewItems}
            {editButton}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
