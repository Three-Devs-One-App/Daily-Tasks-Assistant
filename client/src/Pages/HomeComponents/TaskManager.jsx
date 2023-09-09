import { useState, useEffect } from "react";
import {
  EditIcon,
  CheckIcon,
  PlusIcon,
  SubtractIcon,
} from "../../components/icons";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

const TaskManager = ({ setPage, tasks, taskUpdated }) => {
  const [taskPage, setTaskPage] = useState("Tasks");
  const [modalIdx, setModalIdx] = useState(-1);

  const closeModal = () => setModalIdx(-1);

  const setNewTaskPage = () => setTaskPage("AddTask");
  const setAllTaskPage = () => setTaskPage("Tasks");

  if (!tasks) return <div>Loading ...</div>;
  else {
    return (
      <div id="task_manager_container">
        <div id="task_manager">
          {modalIdx !== -1 && (
            <Modal>
              <TaskViewEdit
                task={tasks[modalIdx]}
                closeModal={closeModal}
                setPage={setPage}
                taskUpdated={taskUpdated}
              />
            </Modal>
          )}
          {taskPage === "Tasks" &&
            tasks.map((task, index) => {
              const openModal = () => {
                setModalIdx(index);
              };
              const removeTaskASync = async () => {
                const res = await fetch(
                  `http://localhost:8080/Task?task_id=${task._id}`,
                  {
                    method: "DELETE",
                    credentials: "include",
                  }
                );
                if (res.status === 200) {
                  taskUpdated();
                } else toast.error("An error has occured");
              };
              const completedTask = async () => {
                const data = {
                  task_id: task._id,
                };
                const res = await fetch("http://localhost:8080/Task", {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                  credentials: "include",
                });

                if (res.status === 200) taskUpdated();
                else toast.error("An error has occured");
              };
              return index === 0 ? (
                <MainTask
                  task={task}
                  openModal={openModal}
                  removeTask={removeTaskASync}
                  completedTask={completedTask}
                />
              ) : (
                <Task
                  task={task}
                  openModal={openModal}
                  removeTask={removeTaskASync}
                  completedTask={completedTask}
                />
              );
            })}
          {taskPage === "AddTask" && (
            <AddTask
              setTaskPage={setTaskPage}
              taskUpdated={taskUpdated}
              setAllTaskPage={setAllTaskPage}
            />
          )}
        </div>
        <button id="NewTaskBtn" onClick={setNewTaskPage}>
          <PlusIcon />
        </button>
      </div>
    );
  }
};

const MainTask = ({ task, openModal, removeTask, completedTask }) => {
  return (
    <div className="main-task task">
      <div className="main-task-info">
        <h1>{task.title}</h1>
        <div className="main-task-info-dd">
          <p>{task.description}</p>
          <div>
            <h2 className="due_label">Due On: </h2>
            <h2>{task.due_date.toLocaleString()}</h2>
          </div>
        </div>
      </div>
      <div className="main-task-button">
        <button onClick={completedTask}>O</button>
        <button onClick={removeTask}>-</button>
        <button onClick={openModal}>E</button>
      </div>
    </div>
  );
};

const Task = ({ task, openModal, removeTask, completedTask }) => {
  return (
    <div className="task">
      <h1 onClick={openModal}>{task.title}</h1>
      <h2 className="due_label">Due On: </h2>
      <h2>{task.due_date.toLocaleString()}</h2>
      <button onClick={completedTask}>o</button>
      <button onClick={removeTask}>-</button>
    </div>
  );
};

const TaskViewEdit = ({ task, closeModal, setPage, taskUpdated }) => {
  const [edit, setEdit] = useState(false);

  const updateRequest = (e) => {
    e.preventDefault();
    handleUpdateRequest();
  };

  const handleUpdateRequest = async () => {
    const title = document.querySelector("#title_inp").value;
    const description = document.querySelector("#description_inp").value;
    const date = document.querySelector("#date_inp").value;

    if (!title || !description || !date)
      return toast.error("All fields must be filled");

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

    if (res.ok) {
      toast.success("Task has been successfully updated!");
      setPage("Profile");
      closeModal();
      taskUpdated();
    } else toast.error("An error occurred");
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
      <h2 className="ender">{task.title}</h2>
      <h1>Description:</h1>
      <p className="ender">{task.description}</p>
      <h1>Due Date:</h1>
      <h3 className="ender">{task.due_date.toLocaleString()}</h3>
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

function AddTask({ setTaskPage, taskUpdated, setAllTaskPage }) {
  const [priority, setPriority] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    const task_name = document.getElementById("task_name").value;
    const task_date = document.getElementById("task_date").value;
    const task_description = document.getElementById("task_description").value;

    if (!task_name || !task_date || !priority || !task_description) {
      toast.error("All fields must be filled!");
    } else handleCreateTask(task_name, task_date, priority, task_description);
  };

  const handleCreateTask = async (
    task_name,
    task_date,
    task_priorty,
    task_description
  ) => {
    const res = await fetch("http://localhost:8080/Task", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_name,
        task_date,
        task_priorty,
        task_description,
      }),
    });
    if (res.status === 200) {
      setTaskPage("Tasks");
      taskUpdated();
    } else {
      toast.error("Error occured");
    }
  };

  return (
    <div id="add-task-con">
      <form id="Task_Form" onSubmit={handleSubmit}>
        <div>
          <h3>Task Name:</h3>
          <input name="Task_Name" id="task_name" type="text" />
        </div>
        <div>
          <h3>Task Date:</h3>
          <input name="Task_Priority" id="task_date" type="datetime-local" />
        </div>
        <div>
          <h3>Task Description:</h3>
          <textarea
            name="Task_Description"
            id="task_description"
            rows="5"
          ></textarea>
        </div>
        <div>
          <h3>{priority}</h3>
          <h3>Task Priority</h3>
          <input
            type="range"
            id="task_priority"
            max="10"
            min="1"
            step="1"
            onChange={(e) => setPriority(e.target.value)}
          />
        </div>
        <button type="submit">Create New Task</button>
      </form>
      <button onClick={setAllTaskPage}>Back</button>
    </div>
  );
}

export default TaskManager;
