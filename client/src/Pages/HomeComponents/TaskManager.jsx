const TaskManager = ({ tasks }) => {
  return (
    <div id="task_manager">
      {tasks.map((task, index) =>
        index === 0 ? <MainTask task={task} /> : <Task task={task} />
      )}
    </div>
  );
};

const MainTask = ({ task }) => {
  return (
    <div className="main-task task">
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <h2>{task.due_date.toLocaleString()}</h2>
    </div>
  );
};

const Task = ({ task }) => {
  return (
    <div className="task">
      <h1>{task.title}</h1>
      <h2>{task.due_date.toLocaleString()}</h2>
    </div>
  );
};

export default TaskManager;
