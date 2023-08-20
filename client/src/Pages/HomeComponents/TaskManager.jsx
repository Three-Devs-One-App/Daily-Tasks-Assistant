import { useState, useEffect } from "react";
const TaskManager = ({ tasks }) => {
  const [modalIdx, setModalIdx] = useState(-1);

  const closeModal = () => setModalIdx(-1);

  return (
    <div id="task_manager">
      {modalIdx >= 0 && (
        <TaskViewEdit task={tasks[modalIdx]} closeModal={closeModal} />
      )}
      {modalIdx === -1 &&
        tasks.map((task, index) => {
          const openModal = () => setModalIdx(index);
          return index === 0 ? (
            <MainTask task={task} openModal={openModal} />
          ) : (
            <Task task={task} openModal={openModal} />
          );
        })}
    </div>
  );
};

const MainTask = ({ task, openModal }) => {
  return (
    <div className="main-task task">
      <h1 onClick={openModal}>{task.title}</h1>
      <p>{task.description}</p>
      <h2 className="due_label">Due On: </h2>
      <h2>{task.due_date.toLocaleString()}</h2>
    </div>
  );
};

const Task = ({ task, openModal }) => {
  return (
    <div className="task">
      <h1 onClick={openModal}>{task.title}</h1>
      <h2 className="due_label">Due On: </h2>
      <h2>{task.due_date.toLocaleString()}</h2>
    </div>
  );
};

const TaskViewEdit = ({ task, closeModal }) => {
  const [edit, setEdit] = useState(false);
  const [warning, setWarning] = useState("");

  const updateRequest = (e) => {
    e.preventDefault();
    handleUpdateRequest();
  };

  const handleUpdateRequest = async () => {
    const title = document.querySelector("#title_inp").value;
    const description = document.querySelector("#description_inp").value;
    const date = document.querySelector("#date_inp");

    const data = JSON.stringify({
      title: title,
      description: description,
      date: date,
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

    if (res.ok) closeModal();
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
      <h1>{warning}</h1>
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
