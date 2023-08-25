import { useState, useEffect } from "react";
import {
  EditIcon,
  CheckIcon,
  PlusIcon,
  SubtractIcon,
} from "../../components/icons";
import Modal from "../../components/Modal";
const TaskManager = ({ setPage }) => {
  const [taskPage, setTaskPage] = useState("Tasks");
  const [modalIdx, setModalIdx] = useState(-1);
  const [tasks, setTasks] = useState(null);
  const [warning, setWarning] = useState("");
  const [updatedTask, setUpdatedTask] = useState(false);

  const closeModal = () => setModalIdx(-1);

  const taskUpdated = () => setUpdatedTask((updatedTask) => !updatedTask);

  const setNewTaskPage = () => setTaskPage("AddTask");
  const setAllTaskPage = () => setTaskPage("Tasks");

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("http://localhost:8080/Task", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 200) {
        const data = await res.json();
        const tasks = data.tasks;
        tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
        setTasks(tasks);
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
        <button id="NewTaskBtn" onClick={setNewTaskPage}>
          <PlusIcon />
        </button>
        {modalIdx !== -1 && (
          <Modal>
            <TaskViewEdit
              task={tasks[modalIdx]}
              closeModal={closeModal}
              setPage={setPage}
              setWarning={setWarning}
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
        {taskPage === "AddTask" && (
          <AddTask
            setTaskPage={setTaskPage}
            taskUpdated={taskUpdated}
            setAllTaskPage={setAllTaskPage}
          />
        )}
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

const TaskViewEdit = ({
  task,
  closeModal,
  setPage,
  setWarning,
  taskUpdated,
}) => {
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
      return setWarning("All fields must be filled");

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
      setPage("Profile");
      closeModal();
      taskUpdated();
    } else setWarning("An error occurred");
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

function AddTask({ setTaskPage, taskUpdated, setAllTaskPage }) {
  const [Task_Name, setTask_Name] = useState("");
  const [Task_Date, setTask_Date] = useState(null);
  const [Task_Description, setTask_Description] = useState("");
  const [warning, setWarning] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const task_name = document.getElementById("task_name").value;
    const task_prio = document.getElementById("task_prio").value;
    const task_description = document.getElementById("task_description").value;

    if (!task_name || !task_prio || !task_description) {
      window.alert("All fields must be filled!");
      return setWarning("All fields must be filled!");
    }
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
    if (data.message === "TaskAdded") {
      setTaskPage("Tasks");
      taskUpdated();
    } else {
      setWarning(data.message);
    }
  };

  return (
    <div id="add-task-con">
      <form id="Task_Form" onSubmit={handleSubmit}>
        <div>
          <h3>Task Name:</h3>
          <input
            name="Task_Name"
            id="task_name"
            type="text"
            onChange={(e) => setTask_Name(e.target.value)}
          />
        </div>
        <div>
          <h3>Task Date:</h3>
          <input
            name="Task_Priority"
            id="task_prio"
            type="datetime-local"
            onChange={(e) => setTask_Date(e.target.value)}
          />
        </div>
        <div>
          <h3>Task Description:</h3>
          <textarea
            name="Task_Description"
            id="task_description"
            rows="5"
            onChange={(e) => setTask_Description(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Create New Task</button>
        {warning && <p id="warning">{warning}</p>}
      </form>
      <button onClick={setAllTaskPage}>Back</button>
    </div>
  );
}

export default TaskManager;
