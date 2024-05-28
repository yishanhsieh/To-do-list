//define html elements 
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

//taskData stores all tasks. It might be empty.
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {}; //A newly-built or edited task 

//check if it's a new task or an existing task.
const addOrUpdateTask = () => {
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`, //make the id unique
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  }; // a taskk's detail

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj); //if id doesn't exit, new a task in the array.
  } else {
    taskData[dataArrIndex] = taskObj; //if not, update the existing one with the latest updatas.
  }

  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer()
  reset()
};


const updateTaskContainer = () => {
  tasksContainer.innerHTML = ""; //this must be here; otherwise, no innerHTML can be appended.
  
  //use destructuring
  taskData.forEach(
    ({ id, title, date, description }) => {
        (tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button> 
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
        </div>
      `) //editTask(this) refers to the element itself.
    }
  );
};


const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1); //remove 1 value at dataArrIndex
  localStorage.setItem("data", JSON.stringify(taskData));
}

const editTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerText = "Update Task";

  taskForm.classList.toggle("hidden");  
}

const reset = () => {

  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
  addOrUpdateTaskBtn.innerText = "Add Task"
}

if (taskData.length) {
  updateTaskContainer();
}

openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset()
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); //prevent it from submitting a form
  addOrUpdateTask();
});
